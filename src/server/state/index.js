/* eslint-disable no-var */

var path = require('path');
var fs = require('fs-extra');
var _ = require('lodash');
var config = require('../configuration');
var logger = require('winston');
var helper = require('../helper');
var initialState = require('./initialState.json');
var analyze = require('../validation/analyzeFile');
var seqLogoGenerator = require('../generators/seqLogoGenerator');
var diffLogoTableGenerator = require('../generators/diffLogoTableGenerator');

var ALIGNMENT_EXT = ['.txt', '.text', '.al', '.alignment'];
var FASTA_EXT = ['.fa', '.fasta'];
var PWM_EXT = ['.pwm'];
var PFM_EXT = ['.pfm'];
var HOMER_EXT = ['.homer', '.hom', '.motif'];
var JASPAR_EXT = ['.jaspar', '.jas'];

logger.level = process.env.LOG_LEVEL || 'info';

function deleteFiles(sessionId, files) {
    var uploadFolder = helper.getUploadFolder(sessionId);
    var promiseMap = [];

    if (files.length === 0) {
        return new Promise((resolve) => fs.emptyDir(uploadFolder, resolve));
    }

    promiseMap = files.map((file) => new Promise((resolve) => fs.unlink(file.path, resolve)));
    return Promise.all(promiseMap);
}

function getInitialState() {
    var state = Object.assign({}, initialState);
    logger.log('debug', 'State.getInitialState', state);
    return Promise.resolve(state);
}

function getState(sessionId) {
    var configFolderPath = helper.getConfigFolder(sessionId);
    var statePath = path.join(configFolderPath, 'state.json');

    logger.log('debug', 'State.getState', statePath);

    return new Promise((resolve) => {
        fs.readFile(statePath, 'utf8', (error, data) => {
            if (error) {
                getInitialState().then(resolve);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}

function writeState(state, sessionId) {
    var configFolderPath = helper.getConfigFolder(sessionId);
    var statePath = path.join(configFolderPath, 'state.json');

    return new Promise((resolve) => {
        fs.outputFile(statePath, JSON.stringify(state), () => {
            resolve(state);
        });
    });
}

function getUploadFolderContent(sessionId) {
    return new Promise((resolve, reject) => {
        var uploadFolder = helper.getUploadFolder(sessionId);

        fs.readdir(uploadFolder, (err, files) => {
            var fileList;
            logger.log('debug', 'State.getUploadFolderContent - uploadFolder %s', uploadFolder);
            if (err) {
                console.error(err); // eslint-disable-line no-console
                reject(err);
            } else {
                fileList = files.map((file) => {
                    var filePath = path.join(uploadFolder, file);
                    var extension = path.extname(file);
                    var initialName = path.basename(file, extension);
                    var fileType = 'unknown';

                    if (ALIGNMENT_EXT.indexOf(extension) > -1) {
                        fileType = 'alignment';
                    } else if (PWM_EXT.indexOf(extension) > -1) {
                        fileType = 'pwm';
                    } else if (PFM_EXT.indexOf(extension) > -1) {
                        fileType = 'pfm';
                    } else if (FASTA_EXT.indexOf(extension) > -1) {
                        fileType = 'fasta';
                    } else if (HOMER_EXT.indexOf(extension) > -1) {
                        fileType = 'homer';
                    } else if (JASPAR_EXT.indexOf(extension) > -1) {
                        fileType = 'jaspar';
                    }

                    return {
                        id: new Buffer(filePath).toString('base64'),
                        path: filePath,
                        originalname: file,
                        name: initialName,
                        type: fileType,
                        error: '',
                        analyzed: false,
                        seqLogoFileSparse: '',
                        seqLogoFile: '',
                        orientation: 'forward',
                        sampleSize: 100
                    };
                });

                resolve(fileList);
            }
        });
    });
}

function filterNewFiles(sessionId, files) {
    logger.log('debug', 'State.filterNewFiles - sessionId %s', sessionId, files);

    return getState(sessionId)
        .then((state) => {
            var existingFileHashes = _.map(state.files, 'id');
            var newFiles = files.filter((file) => (existingFileHashes.indexOf(file.id) === -1));

            logger.log('debug', 'State.filterNewFiles', existingFileHashes, newFiles);

            return Promise.resolve(newFiles);
        });
}

function analyzeFiles(files) {
    var promiseMap = files.map((file) => {
        if (file.analyzed) {
            return Promise.resolve(file);
        }
        return analyze(file);
    });

    logger.log('debug', 'State.analyzeFiles - files count %d', files.length);
    return Promise.all(promiseMap);
}

function setErrors(files, sessionId) {
    return config.getConfiguration(sessionId)
        .then((configuration) => {
            var promiseMap = files.map((file) => {
                file.error = '';
                if (file.parsingError !== '') {
                    file.error = 'Can not parse file: ' + file.parsingError;
                } else if(isNaN(file.sampleSize)) {
                    file.error = 'Sample Size must be an integer.';
                } else if(configuration.enablePvalue && parseInt(file.sampleSize, 10) < 100) {
                    file.error = 'Sample Size must be larger than 100 to calculate proper p-values.';
                }

                return Promise.resolve(file);
            });

            logger.log('debug', 'State.setErrors - files count %d', files.length);
            return Promise.all(promiseMap);
        });
}

function updateStateWithFiles(files, sessionId) {
    logger.log('debug', 'State.updateStateWithFiles - sessionId', sessionId);
    logger.log('debug', 'State.updateStateWithFiles - hasFiles', files.length);

    return getState(sessionId)
        .then((state) => {
            var updatedState = Object.assign(
                {},
                state,
                { files: state.files.concat(files) }
            );
            logger.log('debug', 'State.updateStateWithFiles - updatedState', updatedState);

            return Promise.resolve(updatedState);
        });
}

function updateStateWithoutFiles(sessionId, files) {
    var fileIdsToDelete = _.map(files, 'id');

    logger.log('debug', 'State.updateStateWithoutFiles - sessionId', sessionId);
    logger.log('debug', 'State.updateStateWithoutFiles - hasFiles', files.length);
    logger.log('debug', 'State.updateStateWithoutFiles - delete ids', fileIdsToDelete);

    return getState(sessionId)
        .then((state) => {
            var updatedState = Object.assign(
                {},
                state,
                { files: _.filter(state.files, (file) => (fileIdsToDelete.indexOf(file.id) === -1)) }
            );
            logger.log('debug', 'State.updateStateWithoutFiles - updatedState', updatedState);

            return Promise.resolve(updatedState);
        });
}

function addFilesToState(sessionId) {
    return getUploadFolderContent(sessionId)
        .then((files) => filterNewFiles(sessionId, files))
        .then((files) => analyzeFiles(files))
        .then((files) => setErrors(files, sessionId))
        .then((files) => updateStateWithFiles(files, sessionId))
        .then((state) => writeState(state, sessionId));
}

function copyExampleFiles(sessionId) {
    return new Promise((resolve, reject) => {
        var sourceFolder = helper.getExampleFolder();
        var uploadFolder = helper.getUploadFolder(sessionId);
        fs.mkdirs(uploadFolder);

        fs.readdir(sourceFolder, (err, files) => {
            var copiedFiles = [];
            if (err) {
                console.error(err); // eslint-disable-line no-console
                reject(err);
            } else {
                copiedFiles = files.map((file) => {
                    return new Promise((resolve2, reject2) => {
                        var source = path.join(sourceFolder, file);
                        var target = path.join(uploadFolder, file);
                        fs.copy(source, target, (err2) => {
                            if (err2) {
                                reject2(err2);
                            }
                            resolve2(file);
                        });
                    });
                });
            }
            resolve(Promise.all(copiedFiles));
        });
    });
}

function generateSeqLogos(sessionId, rsource) {
    logger.log('debug', 'State.generateSeqLogos');
    return getState(sessionId)
        .then((state) => seqLogoGenerator(state, sessionId, rsource))
        .then((state) => writeState(state, sessionId));
}

function generateDiffLogoTable(sessionId, fileList, configuration, rsource) {
    logger.log('debug', 'State.generateDiffLogoTable');

    return getState(sessionId)
        .then((state) => diffLogoTableGenerator(state, fileList, configuration, sessionId, rsource))
        .then((state) => writeState(state, sessionId));
}

function removeFilesFromState(sessionId, files) {
    return deleteFiles(sessionId, files)
        .then(() => updateStateWithoutFiles(sessionId, files))
        .then((state) => writeState(state, sessionId));
}

function syncConfiguration(sessionId) {
    return getState(sessionId)
        .then((state) => updateFilesState(sessionId, state.files));
}

function updateFilesState(sessionId, files) {
    return analyzeFiles(files)
        .then(() => setErrors(files, sessionId))
        .then((fileList) => {
            return getState(sessionId)
                .then((state) => {
                    var newState = Object.assign(
                        {},
                        state,
                        { files: [].concat(fileList) }
                    );

                    return Promise.resolve(newState);
                });
        })
        .then((state) => writeState(state, sessionId));
}

function updateResults(sessionId, results) {
    return getState(sessionId)
        .then((state) => {
            var newState = Object.assign(
                {},
                state,
                { results: results }
            );

            return Promise.resolve(newState);
        })
        .then((newState) => writeState(newState, sessionId));
}

function deleteResult(sessionId, timestamp) {
    return getState(sessionId)
        .then((state) => {
            return new Promise((resolve) => {
                var resultDir = helper.getDiffLogoTableFolder(sessionId, timestamp);

                fs.remove(resultDir, (err) => {
                    var results = state.results;
                    var newResults = results.filter((result) => {
                        return result.timestamp !== Number(timestamp);
                    });

                    if (err) {
                        logger.log('error', 'Could not remove result folder', err);
                        resolve(results);
                    }

                    resolve(newResults);
                });

            });
        })
        .then((results) => updateResults(sessionId, results));
}

module.exports = {
    get: getState,
    addFiles: addFilesToState,
    copyExampleFiles: copyExampleFiles,
    syncConfiguration: syncConfiguration,
    removeFiles: removeFilesFromState,
    updateFiles: updateFilesState,
    generateDiffLogoTable: generateDiffLogoTable,
    generateSeqLogos: generateSeqLogos,
    updateResults: updateResults,
    deleteResult: deleteResult
};
