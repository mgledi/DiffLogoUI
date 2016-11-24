/* eslint-disable no-var */

var path = require('path');
var fs = require('fs-extra');
var spawn = require('child_process').spawn;
var express = require('express');
var helper = require('../helper');
var template = require('lodash').template;

var diffLogoTableTemplate = fs.readFileSync(path.resolve(__dirname, '../scripts/diffLogoTable.tpl'));
var processRoutes = express.Router();

function writeConfig(config, sessionId, rsource) {
    var uploadFolder = helper.getUploadFolder(sessionId);
    var configFolder = helper.getConfigFolder(sessionId);
    var motifFolder = path.relative(process.cwd(), uploadFolder);
    var motifNames = config.files.map((file) => {
        var name = file.name || file.originalname.replace(/\..+$/, '');
        return name;
    });

    var files = config.files.reduce((iter, file) => {
        iter[file.name || file.originalname.replace(/\..+$/, '')] = file.originalname;
        return iter;
    }, {});
    var files = config.files.map((file) => {
        var motifName = file.name || file.originalname.replace(/\..+$/, '');
        
        file.motifName = motifName;
        return file;
    });
    var finalConfig = Object.assign(
        {},
        {
            motifFolder: motifFolder,
            motifNames: motifNames,
            files: files,
            outputFolder: path.join(process.cwd(), 'files', sessionId, 'output'),
            rsource: rsource
        }
    );
    console.log(finalConfig);
    var configString = template(diffLogoTableTemplate)(finalConfig);

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
            resolve({ fileList: fs.readdirSync(outputFolder) });
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
