/* eslint-disable no-var */

var path = require('path');
var fs = require('fs-extra');
var logger = require('winston');
var helper = require('../helper');
var initialConfiguration = require('./initialConfiguration.json');

logger.level = process.env.LOG_LEVEL || 'info';

function getInitialConfiguration() {
    var configuration = Object.assign({}, initialConfiguration);
    logger.log('debug', 'Configuration.getInitialConfiguration', configuration);
    return Promise.resolve(configuration);
}

function getConfiguration(sessionId) {
    var configFolderPath = helper.getConfigFolder(sessionId);
    var configurationPath = path.join(configFolderPath, 'configuration.json');

    logger.log('debug', 'Configuration.getConfiguration', configurationPath);

    return new Promise((resolve) => {
        fs.readFile(configurationPath, 'utf8', (error, data) => {
            if (error) {
                getInitialConfiguration().then(resolve);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}

function writeConfiguration(sessionId, configuration) {
    var configFolderPath = helper.getConfigFolder(sessionId);
    var configurationPath = path.join(configFolderPath, 'configuration.json');

    logger.log('debug', 'Configuration.writeConfiguration', configurationPath);

    return new Promise((resolve) => {
        fs.outputFile(configurationPath, JSON.stringify(configuration), () => {
            resolve(configuration);
        });
    });
}

module.exports = {
    getConfiguration: getConfiguration,
    writeConfiguration: writeConfiguration
};
