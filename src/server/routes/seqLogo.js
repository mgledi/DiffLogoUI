/* eslint-disable no-var */

var express = require('express');
var seqLogoRoutes = express.Router();
var state = require('../state');

module.exports = function seqLogoRoute(rsource) {
    seqLogoRoutes.get('/', (req, res) => {
        var sessionId = req.session.id;
        state.generateSeqLogos(sessionId, rsource)
            .then((newState) => res.json(newState));
    });

    return seqLogoRoutes;
};
