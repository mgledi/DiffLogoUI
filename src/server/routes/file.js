const path = require('path');
const fs = require('fs-extra');
const helper = require('../helper');
const express = require('express');
const multer = require('multer');
const fileRoutes = express.Router();

function getUploadFolderContent(sessionId) {
    return new Promise((resolve, reject) => {
        const uploadFolder = helper.getUploadFolder(sessionId);

        fs.readdir(uploadFolder, (err, files) => {
            if (err) {
                console.error(err); // eslint-disable-line no-console
                reject(err);
            } else {
                const fileList = files.map((file) => {
                    const filePath = path.join(uploadFolder, file);

                    return {
                        path: filePath,
                        name: file
                    };
                });

                resolve(fileList);
            }
        });
    });
}

function deleteFiles(list) {
    const promises = list.map((file) => {
        return new Promise((resolve, reject) => {
            fs.remove(file.path, (err) => {
                if (err) {
                    return reject();
                }

                return resolve();
            });
        });
    });

    return Promise.all(promises);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const sessionId = req.session.id;
        const folderPath = helper.getUploadFolder(sessionId);

        fs.ensureDir(folderPath, (err) => {
            cb(err, folderPath);
        });
    },
    filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage: storage });

fileRoutes.get('/list', (req, res) => {
    getUploadFolderContent(req.session.id)
        .then((files) => res.json(files))
        .catch(() => res.status(500).json([]));
});

fileRoutes.post('/', upload.array('files'), (req, res) => {
    getUploadFolderContent(req.session.id)
        .then((files) => res.json(files));
});

fileRoutes.delete('/', (req, res) => {
    const filesToDelete = req.body;

    deleteFiles(filesToDelete)
        .then(() => getUploadFolderContent(req.session.id))
        .then((files) => res.json(files));
});

fileRoutes.get('/result/:name', (req, res) => {
    const sessionId = req.session.id;
    const fileName = req.params.name;
    const options = {
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
