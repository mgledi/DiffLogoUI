/* eslint-disable no-var */
var express = require('express');
var configRoutes = express.Router();
var config = require('../configuration');
var state = require('../state');

configRoutes.put('/', (req, res) => {
    var configuration = req.body;
    config.writeConfiguration(req.session.id, configuration)
        .then((writtenConfiguration) => {
            state.syncConfiguration(req.session.id)
                .then(() => res.json(writtenConfiguration));
        });
});

configRoutes.get('/', (req, res) => {
    config.getConfiguration(req.session.id)
        .then((configuration) => res.json(configuration))
        .catch(() => res.status(500).json([]));
});

module.exports = configRoutes;
