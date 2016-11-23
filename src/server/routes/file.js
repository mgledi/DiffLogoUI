/* eslint-disable no-var */

var path = require('path');
var fs = require('fs-extra');
var helper = require('../helper');
var express = require('express');
var multer = require('multer');
var fileRoutes = express.Router();
var fileValidator = require('../validation/validateFile')

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
                    var initialName = path.basename(file,extension);
                    var fileType = 'unknown';

                    if (extension === '.txt' || extension === '.text' || extension === '.al' || extension === '.alignment') {
                        fileType = 'alignment';
                    } else if (extension === '.pwm') {
                        fileType = 'pwm';
                    } else if (extension === '.fa' || extension === '.fasta') {
                        fileType = 'fasta';
                    }

                    return {
                        path: filePath,
                        originalname: file,
                        name: initialName,
                        type: fileType,
                        error : ''
                    };
                });

                resolve(fileList);
            }
        });
    });
}

function validateFiles(fileList) {
    return fileList.reduce((sequence, file) => {
        return sequence.then(function() {
            return new Promise(function(resolve) {
                if (file.type === 'alignment') {
                    fileValidator.validateAlignment(file.path)
                        .then(function(error) {
                            file.error = error;
                            resolve(fileList);
                        });
                } else {
                    file.error = 'Unknown Filetype';
                    resolve(fileList);
                }
            });
        });
    }, Promise.resolve());
}

function deleteFiles(sessionId) {
    return new Promise((resolve, reject) => {
        var uploadFolder = helper.getUploadFolder(sessionId);

        fs.emptyDir(uploadFolder, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        var sessionId = req.session.id;
        var folderPath = helper.getUploadFolder(sessionId);

        fs.ensureDir(folderPath, (err) => {
            cb(err, folderPath);
        });
    },
    filename: (req, file, cb) => cb(null, file.originalname)
});
var upload = multer({ storage: storage });

fileRoutes.get('/list', (req, res) => {
    getUploadFolderContent(req.session.id)
        .then(validateFiles)
        .then((files) => res.json(files))
        .catch(() => res.status(500).json([]));
});

fileRoutes.post('/', upload.array('files'), (req, res) => {
    getUploadFolderContent(req.session.id)
        .then(validateFiles)
        .then((files) => res.json(files));
});

fileRoutes.delete('/', (req, res) => {

    deleteFiles(req.session.id)
        .then(() => getUploadFolderContent(req.session.id))
        .then((files) => res.json(files));
});

fileRoutes.get('/result/:name', (req, res) => {
    var sessionId = req.session.id;
    var fileName = req.params.name;
    var options = {
        root: path.join(process.cwd(), 'files', sessionId, 'output'),
        dotfiles: 'deny'
    };

    res.sendFile(fileName, options, (err) => {
        if (err) {
            res.status(err.status).end();
        }
    });
});

module.exports = fileRoutes;
