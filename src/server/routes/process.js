/* eslint-disable no-var */

var path = require('path');
var fs = require('fs-extra');
var spawn = require('child_process').spawn;
var express = require('express');
var helper = require('../helper');
var template = require('lodash').template;
var range = require('lodash').range;

var CtcfTemplate = fs.readFileSync(path.resolve(__dirname, '../scripts/ctcf.tpl'));
var processRoutes = express.Router();

var defaultCtfcConfig = {
    width: 1200,
    height: 800,
    aspectRatio: '16/10',
    pdfCompress: 'T'
};

function writeConfig(config, sessionId, rsource) {
    var uploadFolder = helper.getUploadFolder(sessionId);
    var configFolder = helper.getConfigFolder(sessionId);
    var motifFolder = path.relative(configFolder, uploadFolder);
    var motifLength = config.files.length;
    var motifNames = config.files.map((file) => '"' + path.basename(file, '.txt') + '"').join(',');
    var finalConfig = Object.assign(
        defaultCtfcConfig,
        {
            motifFolder: motifFolder,
            motifLength: motifLength,
            motifNames: motifNames,
            outputFolder: path.join(process.cwd(), 'files', sessionId, 'output'),
            motifOptimalOrder: range(motifLength).join(','),
            rsource: rsource
        },
        config
    );
    var configString = template(CtcfTemplate)(finalConfig);

    return new Promise((resolve, reject) => {
        fs.outputFile(path.join(configFolder, config.name + '.R'), configString, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve({config, sessionId});
            }
        });
    });
}

function startProcess(obj) {
    var outputFolder = path.join(process.cwd(), 'files', obj.sessionId, 'output');
    var script = path.relative(process.cwd(), path.join('files', obj.sessionId, 'config', obj.config.name + '.R'));
    var args = ['--no-save', '--slave', '-f ' + script];
    var R = spawn('R', args, { cwd: process.cwd() });

    fs.ensureDirSync(path.join(process.cwd(), 'files', obj.sessionId, 'output'));
    return new Promise((resolve, reject) => {
        R.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        R.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });

        R.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            resolve(Object.assign(
                {},
                obj.config,
                { fileList: fs.readdirSync(outputFolder) }
            ));
        });
    });
}

module.exports = function processRoute(rsource) {
    processRoutes.post('/', (req, res) => {
        var sessionId = req.session.id;
        var config = req.body;

        writeConfig(config, sessionId, rsource)
        .then(startProcess)
        .then((processData) => {
            res.json(processData);
        })
        .catch((err) => {
            res.send(err);
        });
    });

    return processRoutes;
};
