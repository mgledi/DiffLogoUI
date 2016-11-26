
var path = require('path');
var fs = require('fs-extra');
var spawn = require('child_process').spawn;
var helper = require('./helper');
var template = require('lodash').template;

var seqLogoTemplate = fs.readFileSync(path.resolve(__dirname, './scripts/seqLogo.tpl'));


function writeConfig(state, sessionId, rsource) {
    console.log(": " + sessionId + " : " + rsource);
    var uploadFolder = helper.getUploadFolder(sessionId);
    var configFolder = helper.getConfigFolder(sessionId);
    var motifFolder = path.relative(process.cwd(), uploadFolder);

    var finalConfig = Object.assign(
        {},
        {
            motifFolder: motifFolder,
            files: state.files,
            outputFolder: path.join(process.cwd(), 'files', sessionId, 'seqLogos'),
            rsource: rsource
        }
    );
    console.log(finalConfig);
    var configString = template(seqLogoTemplate)(finalConfig);

    return new Promise((resolve, reject) => {
        fs.outputFile(path.join(configFolder, 'seqLogos.R'), configString, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve({state, sessionId});
            }
        });
    });
}

function startProcess(obj) {
    var state = obj.state;
    var sessionId = obj.sessionId;

	var outputFolder = path.join(process.cwd(), 'files', sessionId, 'seqLogos');
    var script = path.relative(process.cwd(), path.join('files', sessionId, 'config', 'seqLogos.R'));
    var args = ['--no-save', '--slave', '-f ' + script];
    var R = spawn('R', args, { cwd: process.cwd() });

    fs.ensureDirSync(path.join(process.cwd(), 'files', obj.sessionId, 'seqLogos'));
    return new Promise((resolve, reject) => {
        R.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        R.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });

        R.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            resolve(obj);
        });
    });
}

function updateState(obj) {
    var state = obj.state;
    var sessionId = obj.sessionId;

    var updatedFiles = state.files.map((file) => {
        file.seqLogoPath = path.join(process.cwd(), 'files', sessionId,'seqLogos','seqlogo_' + path.basename(file.path) + '.png');
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
}
