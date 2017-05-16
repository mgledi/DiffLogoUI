/* eslint-disable no-var */

var path = require('path');
var fs = require('fs-extra');
var spawn = require('child_process').spawn;
var logger = require('winston');
var template = require('lodash').template;
var helper = require('../helper');
var diffLogoTableTemplate = fs.readFileSync(path.resolve(__dirname, '../scripts/diffLogoTable.tpl')); // eslint-disable-line no-sync

logger.level = process.env.LOG_LEVEL || 'info';

function writeConfig(state, fileList, configuration, sessionId, rsource) {
    var timestamp = new Date().getTime();
    var uploadFolder = helper.getUploadFolder(sessionId);
    var configFolder = helper.getConfigFolder(sessionId);
    var outputFolder = helper.getRelDiffLogoTableFolder(sessionId, timestamp, process.cwd());
    var motifFolder = path.relative(process.cwd(), uploadFolder);
    var rFolder = path.relative(process.cwd(), rsource);
    var finalConfig = Object.assign(
        {},
        {
            motifFolder: motifFolder,
            files: fileList,
            configuration: configuration,
            outputFolder: outputFolder,
            rsource: rFolder
        }
    );
    var configString = template(diffLogoTableTemplate)(finalConfig).replace(/\n\s*\n\s*\n/g, '\n\n');
    var configFilePath = path.join(configFolder, 'diffLogoTable.R');

    logger.log('debug', 'DiffLogoTableGenerator.writeConfig %s %s', sessionId, rsource);
    logger.log('debug', 'DiffLogoTableGenerator.writeConfig - upload folder - %s', uploadFolder);
    logger.log('debug', 'DiffLogoTableGenerator.writeConfig - config folder - %s', configFolder);
    logger.log('debug', 'DiffLogoTableGenerator.writeConfig - motif folder - %s', motifFolder);
    logger.log('debug', 'DiffLogoTableGenerator.writeConfig - final config -', finalConfig);
    logger.log('debug', 'DiffLogoTableGenerator.writeConfig - template -', configString);

    return new Promise((resolve, reject) => {
        fs.outputFile(configFilePath, configString, (err) => {
            if (err) {
                logger.log('error', 'DiffLogoTableGenerator.writeConfig - write config error - %s', err);
                reject(err);
            } else {
                resolve({state, fileList, timestamp, sessionId, outputFolder, configFilePath });
            }
        });
    });
}

function startProcess(obj) {
    var configFilePath = obj.configFilePath;
    var outputFolder = obj.outputFolder;
    var scriptPath = path.relative(process.cwd(), configFilePath);
    var args = ['--no-save', '--slave', '-f ' + scriptPath];
    var R;

    logger.log('debug', 'DiffLogoTableGenerator.startProcess - config path - %s', configFilePath);
    logger.log('debug', 'DiffLogoTableGenerator.startProcess - output folder - %s', outputFolder);
    logger.log('debug', 'DiffLogoTableGenerator.startProcess - script path - %s', scriptPath);
    logger.log('debug', 'DiffLogoTableGenerator.startProcess - R argumnents - %s', args);

    return new Promise((resolve) => {
        fs.ensureDir(outputFolder, (err) => {
            if (err) {
                logger.log();
                resolve(obj);
                return;
            }

            R = spawn('R', args, { cwd: process.cwd() });
            R.stdout.on('data', (data) => logger.log('debug', 'R: %s', data));

            R.stderr.on('data', (data) => logger.log('debug', 'R: %s', data));

            R.on('close', (code) => {
                logger.log('debug', 'R: exited with %d', code);
                resolve(obj);
            });
        });
    });
}

function moveConfigToOutputFolder(obj) {
    var configFilePath = obj.configFilePath;
    var outputFolder = obj.outputFolder;

    return new Promise((resolve) => {

        fs.move(configFilePath, outputFolder + '/diffLogoTable.R', (err) => {
            if (err) {
                logger.log('error', 'Couldn\'t move config file', err);
            }

            resolve(obj);
        });
    });
}

function updateState(obj) {
    var state = obj.state;
    var timestamp = obj.timestamp;
    var outputFolder = obj.outputFolder;

    return new Promise((resolve) => {
        fs.readdir(outputFolder, (err, files) => {
            var result = {
                timestamp,
                files,
                adhoc: true
            };

            if (err) {
                logger.log('error', 'DiffLogoTableGenerator.updateState - read dir error -', err);
            }

            resolve(Object.assign({}, state,
                { results: state.results.concat([result]) }
            ));
        });
    });
}

module.exports = function generateDiffLogoTable(state, fileList, configuration, sessionId, rsource) {
    logger.log('debug', 'generateDiffLogoTable', sessionId, configuration, rsource);
    return writeConfig(state, fileList, configuration, sessionId, rsource)
        .then((obj) => startProcess(obj))
        .then((obj) => moveConfigToOutputFolder(obj))
        .then((obj) => updateState(obj));
};
