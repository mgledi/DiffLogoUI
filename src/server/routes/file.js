/* eslint-disable no-var */

var fs = require('fs-extra');
var helper = require('../helper');
var express = require('express');
var multer = require('multer');
var fileRoutes = express.Router();
var state = require('../state');
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
    state.get(req.session.id)
        .then((newState) => res.json(newState))
        .catch(() => res.status(500).json([]));
});

fileRoutes.post('/example', (req, res) => {
    state.copyExampleFiles(req.session.id)
        .then(() => {
            state.addFiles(req.session.id)
                .then((newState) => res.json(newState));
        });
});

fileRoutes.post('/', upload.array('files'), (req, res) => {
    state.addFiles(req.session.id)
        .then((newState) => res.json(newState));
});

fileRoutes.delete('/', (req, res) => {
    var files = req.body.files;

    state.removeFiles(req.session.id, files)
        .then((newState) => res.json(newState));
});

fileRoutes.put('/', (req, res) => {
    var files = req.body;

    state.updateFiles(req.session.id, files)
        .then((newState) => res.json(newState));
});

module.exports = fileRoutes;
