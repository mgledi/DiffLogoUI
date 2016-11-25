/* eslint-disable no-var */

var path = require('path');
var fs = require('fs-extra');
var _ = require('lodash');
var logger = require('winston');
var helper = require('../helper');
var initialState = require('./initialState.json');
var fileValidator = require('../validation/validateFile');
var seqLogoGenerator = require('../seqLogoGenerator');

var ALIGNMENT_EXT = ['.txt', '.text', '.al', '.alignment'];
var FASTA_EXT = ['.fa', '.fasta'];
var PWM_EXT = ['.pwm'];

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
                    } else if (FASTA_EXT.indexOf(extension) > -1) {
                        fileType = 'fasta';
                    }

                    return {
                        id: new Buffer(filePath).toString('base64'),
                        path: filePath,
                        originalname: file,
                        name: initialName,
                        type: fileType,
                        error: '',
                        validated: false,
                        seqLogoPath: ''
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

function validateFiles(files) {
    var promiseMap = files.map((file) => {
        return fileValidator.validate(file)
            .then((error) => {
                file.error = error;
                file.validated = true;

                return Promise.resolve(file);
            });
    });

    logger.log('debug', 'State.validateFiles - files count %d', files.length);

    return Promise.all(promiseMap);
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
        .then((files) => validateFiles(files))
        .then((files) => updateStateWithFiles(files, sessionId))
        .then((state) => writeState(state, sessionId));
}


function generateSequenceLogos(sessionId, rsource) {
    logger.log('debug', 'State.generateSequenceLogos');
    return getState(sessionId)
        .then((state) => seqLogoGenerator(state, sessionId, rsource))
        .then((state) => writeState(state, sessionId));
}

function removeFilesFormState(sessionId, files) {
    return deleteFiles(sessionId, files)
        .then(() => updateStateWithoutFiles(sessionId, files))
        .then((state) => writeState(state, sessionId));
}

function updateFilesState(sessionId, files) {
    return getState(sessionId)
        .then((state) => {
            var newState = Object.assign(
                {},
                state,
                { files: [].concat(files) }
            );

            return Promise.resolve(newState);
        })
        .then((state) => writeState(state, sessionId));
}

module.exports = {
    get: getState,
    addFiles: addFilesToState,
    removeFiles: removeFilesFormState,
    updateFiles: updateFilesState,
    generateSequenceLogos: generateSequenceLogos
};
