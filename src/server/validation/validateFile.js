/* eslint-disable no-var */

var logger = require('winston');
var lineReader = require('line-reader');
var path = require('path');
logger.level = process.env.LOG_LEVEL || 'info';

function getLineLengthError(line, filePath) {
    return `Error in line ${line}. All lines in ${path.basename(filePath)} must have the same length!`;
}

function validateAlignment(filePath) {
    logger.log('debug', 'Validating alignment: %s', filePath);

    return new Promise((resolve) => {
        var length = -1;
        var error = '';
        var row = 0;

        lineReader.eachLine(filePath, (line, last) => {
            // in an alignment file there can be scores
            var tfbs = line.split('\t')[0];

            row++;
            if(length === -1) {
                length = tfbs.length;
            } else if(tfbs.length === 0) {
                // do nothing
            } else if(length !== tfbs.length) {
                error = getLineLengthError(row, filePath);
                logger.log('debug', 'validateAlignment - line length error -%s', error);
                resolve(error);
                return false;
            }

            if (last) {
                resolve(error);
            }
        });
    });
}

function validateFasta(filePath) {
    logger.log('debug', 'Validating fasta: %s', filePath);

    return new Promise((resolve) => {
        var length = -1;
        var error = '';
        var row = 0;
        var tfbs = '';

        lineReader.eachLine(filePath, (line, last) => {
            line = line.trim();

            row++;

            if (line.length > 0) {
                if (line.startsWith('>') || line.startsWith(';')) {
                    if(tfbs.length > 0) {
                        logger.log('debug', '%d: %s', row, tfbs);
                        if(length === -1) {
                            length = tfbs.length;
                        } else if(length !== tfbs.length) {
                            error = getLineLengthError(row - 1, filePath);
                            logger.log('debug', 'validateFasta - line length error - %s', error);
                            resolve(error);
                            return false;
                        }
                    }

                    tfbs = '';
                } else {
                    // concatenate tfbs
                    tfbs += line;
                }
            }

            if (last) {
                if(length !== tfbs.length) {
                    error = getLineLengthError(row - 1, filePath);
                    logger.log('debug', 'validateFasta - line length error - %s', error);
                }
                resolve(error);
            }
        });
    });
}

function getSumForPwmColumn(alphabet, columnCount) {
    return alphabet.reduce((sum, line) => (sum + Number(line[columnCount])), 0);
}

function validatePWM(filePath) {
    logger.log('debug', 'Validating PWM: %s', filePath);

    return new Promise((resolve) => {
        var error = '';
        var alphabet = [];
        var lineCount = 0;
        var lineLength = -1;
        var m = 0;
        var totalColumns = 0;
        var columnSum = 0;

        lineReader.eachLine(filePath, (line, last) => {
            var lineSplit = line.trim().split('\t');
            var splitLength = lineSplit.length;

            lineCount++;

            if (lineLength > -1 && lineLength !== lineSplit.length) {
                error = getLineLengthError(lineCount, filePath);
                logger.log('debug', 'validatePWM - line length error - %s', error);
                resolve(error);
                return false;
            }

            for (m = 0; m < splitLength; m++) {
                if (isNaN(lineSplit[m])) {
                    error = `Element ${m + 1} in line ${lineCount} is not a valid number.`;
                    break;
                }
            }

            if (error !== '') {
                logger.log('debug', 'validatePWM - NAN error - %s', error);
                resolve(error);
                return false;
            }

            lineLength = lineSplit.length;
            alphabet.push(lineSplit);
            if (last) {
                totalColumns = lineSplit.length;

                for (m = 0; m <= totalColumns; m++) {
                    columnSum = getSumForPwmColumn(alphabet, m);
                    if (Math.abs(1 - columnSum) > 0.000001) {
                        error = `Elements in column ${m + 1} sum not to 1.0 (${columnSum})`;
                        logger.log('debug', 'validatePWM - sum error - %s', error);
                        resolve(error);
                    }
                }

                resolve(error);
            }
        });
    });
}

function validatePFM(filePath) {
    logger.log('debug', 'Validating PFM: %s', filePath);

    return new Promise((resolve) => {
        var error = '';
        var alphabet = [];
        var lineCount = 0;
        var lineLength = -1;
        var m = 0;
        var totalColumns = 0;
        var columnSum = 0;

        lineReader.eachLine(filePath, (line, last) => {
            var lineSplit = line.trim().split('\t');
            var splitLength = lineSplit.length;

            lineCount++;

            if (lineLength > -1 && lineLength !== lineSplit.length) {
                error = getLineLengthError(lineCount, filePath);
                logger.log('debug', 'validatePFM - line length error - %s', error);
                resolve(error);
                return false;
            }

            // try parsing all numbers
            for (m=0; m < splitLength; m++) {
                if (isNaN(lineSplit[m])) {
                    error = `Element ${m + 1} in line ${lineCount} is not a valid number.`;
                    break;
                }
            }

            if (error !== '') {
                logger.log('debug', 'validatePFM - NAN error - %s', error);
                resolve(error);
                return false;
            }

            lineLength = lineSplit.length;
            alphabet.push(lineSplit);
            if (last) {
                for (m=0; m <= lineLength; m++) {
                    columnSum = getSumForPwmColumn(alphabet, m);
                    if (columnSum < 1) {
                        error = `At least one element in column ${m + 1} must be larger than 0.`;
                        logger.log('debug', 'validatePFM - sum error - %s', error);
                        resolve(error);
                    }
                }
                resolve(error);
            }
        });
    });
}

module.exports = function validate(file) {
    const error = 'Unknown filetype. Please see help for supported file types';

    switch(file.type) {
        case 'alignment':
            return validateAlignment(file.path);
        case 'fasta':
            return validateFasta(file.path);
        case 'pwm':
            return validatePWM(file.path);
        case 'pfm':
            return validatePFM(file.path);
        default:
            logger.log('debug', 'validate - unknow filetype - %s', error);
            return Promise.resolve(error);
    }
}
