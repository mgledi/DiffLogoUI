/* eslint-disable  no-var */

var path = require('path');
var fs = require('fs-extra');
var spawn = require('child_process').spawn;
var helper = require('../helper');
var template = require('lodash').template;
var logger = require('winston');
var seqLogoTemplate = fs.readFileSync(path.resolve(__dirname, '../scripts/seqLogo.tpl')); // eslint-disable-line no-sync

logger.level = process.env.LOG_LEVEL || 'info';

function writeConfig(state, sessionId, rsource) {
    var uploadFolder = helper.getUploadFolder(sessionId);
    var configFolder = helper.getConfigFolder(sessionId);
    var motifFolder = path.relative(process.cwd(), uploadFolder);
    var outputFolder = helper.getRelSeqLogoFolder(sessionId, process.cwd());
    var rFolder = path.relative(process.cwd(), rsource);
    var finalConfig = Object.assign(
        {},
        {
            motifFolder: motifFolder,
            files: state.files,
            outputFolder: outputFolder,
            rsource: rFolder
        }
    );
    var configString = template(seqLogoTemplate)(finalConfig);

    logger.log('debug', 'SeqLogoGenerator.writeConfig %s %s', sessionId, rsource);
    logger.log('debug', 'SeqLogoGenerator.writeConfig - upload folder - %s', uploadFolder);
    logger.log('debug', 'SeqLogoGenerator.writeConfig - config folder - %s', configFolder);
    logger.log('debug', 'SeqLogoGenerator.writeConfig - motif folder - %s', motifFolder);
    logger.log('debug', 'SeqLogoGenerator.writeConfig - final config -', finalConfig);
    logger.log('debug', 'SeqLogoGenerator.writeConfig - template -', configString);

    return new Promise((resolve, reject) => {
        fs.outputFile(path.join(configFolder, 'seqLogos.R'), configString, (err) => {
            if (err) {
                logger.log('error', 'SeqLogoGenerator.writeConfig - write config error - %s', err);
                reject(err);
            } else {
                resolve({state, sessionId});
            }
        });
    });
}

function startProcess(obj) {
    var sessionId = obj.sessionId;
    var configFolder = helper.getConfigFolder(sessionId);
    var seqLogoFolder = helper.getSeqLogoFolder(sessionId);
    var scriptPath = path.relative(process.cwd(), path.join(configFolder, 'seqLogos.R'));
    var args = ['--no-save', '--slave', '-f ' + scriptPath];
    var R;

    logger.log('debug', 'SeqLogoGenerator.startProcess - config folder - %s', configFolder);
    logger.log('debug', 'SeqLogoGenerator.startProcess - seq logo folder - %s', seqLogoFolder);
    logger.log('debug', 'SeqLogoGenerator.startProcess - script path - %s', scriptPath);
    logger.log('debug', 'SeqLogoGenerator.startProcess - R argumnents - %s', args);

    return new Promise((resolve) => {
        fs.ensureDir(seqLogoFolder, (err) => {
            if (err) {
                logger.log('error', 'SeqLogoGenerator.startProcess - error -', err);
                resolve(obj); // TODO add proper error handling to not write seqLogo path to state
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
    var state = obj.state;
    var updatedFiles = state.files.map((file) => {
        if (file.error === '') {
            file.seqLogoFile = 'seqLogo_' + path.basename(file.path) + '.png';
            file.seqLogoFileSparse = 'seqLogo_' + path.basename(file.path) + '_sparse.png';
        }
        return file;
    });
    var newState = Object.assign(
            {},
            state,
            { files: updatedFiles }
        );
    return Promise.resolve(newState);
}

module.exports = (state, sessionId, rsource) => {
    return writeConfig(state, sessionId, rsource)
        .then((obj) => startProcess(obj))
        .then((obj) => updateState(obj));
};
