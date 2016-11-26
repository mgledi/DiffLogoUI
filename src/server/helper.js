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

function getSeqLogoFolder(sessionId) {
    return path.join(getSessionFolder(sessionId), 'seqLogos');
}

module.exports = {
    getSessionFolder: getSessionFolder,
    getUploadFolder: getUploadFolder,
    getConfigFolder: getConfigFolder,
    getSeqLogoFolder: getSeqLogoFolder
};
