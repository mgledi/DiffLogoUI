/* eslint-disable no-var */

var express = require('express');
var resultRoutes = express.Router();
var state = require('../state');
var helper = require('../helper');

resultRoutes.get('/diff-table/:timestamp/:name', (req, res) => {
    var sessionId = req.session.id;
    var timestamp = req.params.timestamp;
    var fileName = req.params.name;
    var folder = helper.getDiffLogoTableFolder(sessionId, timestamp);
    var options = {
        root: folder,
        dotfiles: 'deny'
    };

    res.sendFile(fileName, options, (err) => {
        if (err) {
            res.status(err.status).end();
        }
    });
});

resultRoutes.get('/seq-logo/:name', (req, res) => {
    var sessionId = req.session.id;
    var fileName = req.params.name;
    var folder = helper.getSeqLogoFolder(sessionId);
    var options = {
        root: folder,
        dotfiles: 'deny'
    };

    res.sendFile(fileName, options, (err) => {
        if (err) {
            res.status(err.status).end();
        }
    });
});

resultRoutes.put('/', (req, res) => {
    var sessionId = req.session.id;
    var results = req.body;

    state.updateResults(sessionId, results)
        .then((newState) => res.json(newState));
});

module.exports = resultRoutes;
