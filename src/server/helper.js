/* eslint-disable no-var */

var path = require('path');

function getSessionFolder(sessionId) {
    return path.join(process.cwd(), 'files', sessionId);
}

function getUploadFolder(sessionId) {
    return path.join(getSessionFolder(sessionId), 'upload');
}

function getConfigFolder(sessionId) {
    return path.join(getSessionFolder(sessionId), 'config');
}

module.exports = {
    getSessionFolder: getSessionFolder,
    getUploadFolder: getUploadFolder,
    getConfigFolder: getConfigFolder
};
