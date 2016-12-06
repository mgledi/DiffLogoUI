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

function getDiffLogoTableFolder(sessionId, timestamp) {
    return path.join(getSessionFolder(sessionId), 'output', `${timestamp}`);
}

function getSeqLogoFolder(sessionId) {
    return path.join(getSessionFolder(sessionId), 'seqLogos');
}

module.exports = {
    getSessionFolder: getSessionFolder,
    getUploadFolder: getUploadFolder,
    getConfigFolder: getConfigFolder,
    getDiffLogoTableFolder: getDiffLogoTableFolder,
    getSeqLogoFolder: getSeqLogoFolder
};
