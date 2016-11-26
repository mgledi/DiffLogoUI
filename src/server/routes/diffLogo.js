/* eslint-disable no-var */

var express = require('express');
var state = require('../state');
var diffLogoRoutes = express.Router();

module.exports = function diffLogoRoute(rsource) {
    diffLogoRoutes.post('/', (req, res) => {
        var sessionId = req.session.id;
        var fileList = req.body.files;

        state.generateDiffLogoTable(sessionId, fileList, rsource)
            .then((newState) => res.json(newState));
    });

    return diffLogoRoutes;
};
