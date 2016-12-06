/* eslint-disable no-var */

var express = require('express');
var resultRoutes = express.Router();
var state = require('../state');

resultRoutes.put('/', (req, res) => {
    var sessionId = req.session.id;
    var results = req.body;

    state.updateResults(sessionId, results)
        .then((newState) => res.json(newState));
});

module.exports = resultRoutes;
