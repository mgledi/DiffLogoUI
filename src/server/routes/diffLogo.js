/* eslint-disable no-var */

var express = require('express');
var state = require('../state');
var diffLogoRoutes = express.Router();

module.exports = function diffLogoRoute(rsource) {
    diffLogoRoutes.post('/', (req, res) => {
        var sessionId = req.session.id;
        var fileList = req.body.files;
        var configuration = req.body.configuration;

        state.generateDiffLogoTable(sessionId, fileList, configuration, rsource)
            .then((newState) => res.json(newState));
    });

    return diffLogoRoutes;
};
