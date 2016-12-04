/* eslint-disable no-var */

var path = require('path');
var fs = require('fs-extra');
var spawn = require('child_process').spawn;
var logger = require('winston');
var template = require('lodash').template;
var helper = require('../helper');
var diffLogoTableTemplate = fs.readFileSync(path.resolve(__dirname, '../scripts/diffLogoTable.tpl')); // eslint-disable-line no-sync

logger.level = process.env.LOG_LEVEL || 'info';
logger.handleExceptions(new logger.transports.Console());

function writeConfig(state, fileList, sessionId, rsource) {
    var uploadFolder = helper.getUploadFolder(sessionId);
    var configFolder = helper.getConfigFolder(sessionId);
    var outputFolder = helper.getDiffLogoTableFolder(sessionId);
    var motifFolder = path.relative(process.cwd(), uploadFolder);
    var finalConfig = Object.assign(
        {},
        {
            motifFolder: motifFolder,
            files: fileList,
            outputFolder: outputFolder,
            rsource: rsource
        }
    );
    var configString = template(diffLogoTableTemplate)(finalConfig);

    logger.log('debug', 'DiffLogoTableGenerator.writeConfig %s %s', sessionId, rsource);
    logger.log('debug', 'DiffLogoTableGenerator.writeConfig - upload folder - %s', uploadFolder);
    logger.log('debug', 'DiffLogoTableGenerator.writeConfig - config folder - %s', configFolder);
    logger.log('debug', 'DiffLogoTableGenerator.writeConfig - motif folder - %s', motifFolder);
    logger.log('debug', 'DiffLogoTableGenerator.writeConfig - final config -', finalConfig);
    logger.log('debug', 'DiffLogoTableGenerator.writeConfig - template -', configString);

    return new Promise((resolve, reject) => {
        fs.outputFile(path.join(configFolder, 'diffLogoTable.R'), configString, (err) => {
            if (err) {
                logger.log('error', 'DiffLogoTableGenerator.writeConfig - write config error - %s', err);
                reject(err);
            } else {
                resolve({state, fileList, sessionId});
            }
        });
    });
}
function startProcess(obj) {
    var sessionId = obj.sessionId;
    var configFolder = helper.getConfigFolder(sessionId);
    var outputFolder = helper.getDiffLogoTableFolder(sessionId);
    var scriptPath = path.relative(process.cwd(), path.join(configFolder, 'diffLogoTable.R'));
    var args = ['--no-save', '--slave', '-f ' + scriptPath];
    var R;

    logger.log('debug', 'DiffLogoTableGenerator.startProcess - config folder - %s', configFolder);
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

function updateState(obj) {
    var sessionId = obj.sessionId;
    var state = obj.state;
    var outputFolder = helper.getDiffLogoTableFolder(sessionId);
    return new Promise((resolve) => {
        fs.readdir(outputFolder, (err, files) => {
            var newState;

            if (err) {
                logger.log('error', 'DiffLogoTableGenerator.updateState - read dir error -', err);
            }

            newState = Object.assign(
                {},
                state,
                { output: files }
            );

            resolve(newState);
        });
    });
}

module.exports = function generateDiffLogoTable(state, fileList, sessionId, rsource) {
    logger.log('debug', 'generateDiffLogoTable', sessionId, rsource);
    return writeConfig(state, fileList, sessionId, rsource)
        .then((obj) => startProcess(obj))
        .then((obj) => updateState(obj));
};
