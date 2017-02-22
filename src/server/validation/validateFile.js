/* eslint-disable no-var */

var logger = require('winston');
var lineReader = require('line-reader');
var path = require('path');
logger.level = process.env.LOG_LEVEL || 'info';

function getLineLengthError(line, filePath) {
    return `Error in line ${line}. All lines in ${path.basename(filePath)} must have the same length!`;
}

function getUnkownSymbolError(line, filePath) {
    return `Error in line ${line}. All sequences in ${path.basename(filePath)} must only consist of letters!`;
}

function getSumForPwmColumn(alphabet, columnCount) {
    return alphabet.reduce((sum, line) => (sum + Number(line[columnCount])), 0);
}

function validateAlignment(filePath) {
    logger.log('debug', 'Validating alignment: %s', filePath);

    return new Promise((resolve) => {
        var length = -1;
        var error = '';
        var row = 0;

        lineReader.eachLine(filePath, (line, last) => {
            // in an alignment file there can be scores
            var tfbs = line.split('\t')[0].trim();

            row++;
            if(length === -1) {
                length = tfbs.length;
            }
            if(tfbs.length === 0) {
                // empty line, do nothing
            } else if(length !== tfbs.length) {
                error = getLineLengthError(row, filePath);
                logger.log('debug', 'validateAlignment - line length error -%s', error);
                resolve(error);
                return false;
            } else if(!tfbs.match(/^[A-Za-z\-]+$/)) {
                error = getUnkownSymbolError(row, filePath);
                logger.log('debug', 'validateAlignment - character error -%s', error);
                resolve(error);
                return false;
            }

            if (last) {
                resolve(error);
            }
            return true;
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
                        }
                        if(length !== tfbs.length) {
                            error = getLineLengthError(row - 1, filePath);
                            logger.log('debug', 'validateFasta - line length error - %s', error);
                            resolve(error);
                            return false;
                        } else if(!(/^[A-Za-z\-]+$/).test(tfbs)) {
                            error = getUnkownSymbolError(row, filePath);
                            logger.log('debug', 'validateFasta - character error -%s', error);
                            resolve(error);
                            return false;
                        }
                    }

                    tfbs = '';
                } else {
                    // concatenate tfbs
                    tfbs = tfbs + line;
                }
            }

            if (last) {
                if(length !== tfbs.length) {
                    error = getLineLengthError(row - 1, filePath);
                    logger.log('debug', 'validateFasta - line length error - %s', error);
                }
                resolve(error);
            }
            return true;
        });
    });
}

function validatePWM(filePath) {
    logger.log('debug', 'Validating PWM: %s', filePath);

    return new Promise((resolve) => {
        var error = '';
        var pwm = [];
        var lineCount = 0;
        var columnCount = -1;
        var m = 0;
        var totalColumns = 0;
        var columnSum = 0;

        lineReader.eachLine(filePath, (line, last) => {
            var lineSplits = line.trim().match(/\S+/g);
            var splitCount = lineSplits === null ? 0 : lineSplits.length;

            lineCount++;

            if (columnCount > -1 && columnCount !== splitCount) {
                error = getLineLengthError(lineCount, filePath);
                logger.log('debug', 'validatePWM - line length error - %s', error);
                resolve(error);
                return false;
            }

            for (m = 0; m < splitCount; m++) {
                if (isNaN(lineSplits[m])) {
                    error = `Element ${m + 1} in line ${lineCount} is not a valid number.`;
                    logger.log('debug', 'validatePWM - NAN error - %s', error);
                    resolve(error);
                    return false;
                }
            }

            columnCount = splitCount;
            pwm.push(lineSplits);
            if (last) {
                totalColumns = splitCount;

                for (m = 0; m <= totalColumns; m++) {
                    columnSum = getSumForPwmColumn(pwm, m);
                    if (Math.abs(1 - columnSum) > 0.001) {
                        error = `Elements in column ${m + 1} sum not to 1.0 (${columnSum})`;
                        logger.log('debug', 'validatePWM - sum error - %s', error);
                        resolve(error);
                        return false;
                    }
                }
            }
            if (last) {
                resolve(error);
            }
            return true;
        });
    });
}

function validatePFM(filePath) {
    logger.log('debug', 'Validating PFM: %s', filePath);

    return new Promise((resolve) => {
        var error = '';
        var alphabet = [];
        var lineCount = 0;
        var globalSplitCount = -1;
        var columnSum = 0;

        lineReader.eachLine(filePath, (line, last) => {
            var lineSplits = line.trim().match(/\S+/g);
            var splitCount = lineSplits === null ? 0 : lineSplits.length;
            var m = 0;

            lineCount++;

            if (globalSplitCount > -1 && globalSplitCount !== splitCount) {
                error = getLineLengthError(lineCount, filePath);
                logger.log('debug', 'validatePFM - line length error - %s', error);
                resolve(error);
                return false;
            }

            // try parsing all numbers
            for (; m < splitCount; m++) {
                if (isNaN(lineSplits[m])) {
                    error = `Element ${m + 1} in line ${lineCount} is not a valid number.`;
                    logger.log('debug', 'validatePFM - NAN error - %s', error);
                    resolve(error);
                    return false;
                }
            }

            globalSplitCount = splitCount;
            alphabet.push(lineSplits);
            if (last) {
                for (m = 0; m <= globalSplitCount; m++) {
                    columnSum = getSumForPwmColumn(alphabet, m);
                    if (columnSum < 1) {
                        error = `At least one element in column ${m + 1} must be larger than 0.`;
                        logger.log('debug', 'validatePFM - sum error - %s', error);
                        resolve(error);
                        return false;
                    }
                }
            }
            if (last) {
                resolve(error);
            }
            return true;
        });
    });
}

function validateHomer(filePath) {
    logger.log('debug', 'Validating Homer: %s', filePath);
    return new Promise((resolve) => {
        var error = '';
        var lineCount = 0;
        var globalSplitCount = -1;

        lineReader.eachLine(filePath, (line, last) => {
            var lineSplits = line.trim().match(/\S+/g);
            var splitCount = lineSplits === null ? 0 : lineSplits.length;
            var m = 0;

            lineCount++;

            if (lineCount === 1) {
                if(!line.startsWith('>')) {
                    error = 'First line must start with ">"';
                    logger.log('debug', 'validateJaspar - first line error - %s', error);
                    resolve(error);
                    return false;
                }
            }
            if (globalSplitCount > -1 && globalSplitCount !== splitCount) {
                error = getLineLengthError(lineCount, filePath);
                logger.log('debug', 'validateHomer - line length error - %s', error);
                resolve(error);
                return false;
            }

            // try parsing all numbers
            if(splitCount > 0 && !line.startsWith('>')) {
                for (; m < splitCount; m++) {
                    if (isNaN(lineSplits[m])) {
                        error = `Element ${m + 1} in line ${lineCount} is not a valid number.`;
                        resolve(error);
                        return false;
                    }
                }
            }
            if (last) {
                resolve(error);
            }
            return true;
        });
    });
}

function validateJaspar(filePath) {
    logger.log('debug', 'Validating Jaspar: %s', filePath);
    return new Promise((resolve) => {
        var error = '';
        var lineCount = 0;
        var columnCount = -1;
        var m = 0;
        var pfm = '';
        var columns;

        lineReader.eachLine(filePath, (line, last) => {
            lineCount++;

            if (lineCount === 1) {
                if(!line.startsWith('>')) {
                    error = 'First line must start with ">"';
                    logger.log('debug', 'validateJaspar - first line error - %s', error);
                    resolve(error);
                    return false;
                }
            } else {
                pfm = (/[ACGT]\s+\[(.*)\]/g).exec(line.trim())[1];
                if(pfm === null || pfm.length === 0) {
                    error = 'Error in line ' + lineCount + '. "' + pfm + '" seem not to encoded nucleotide frequencies.';
                    logger.log('debug', 'validateJaspar - no numbers error - %s', error);
                    resolve(error);
                    return false;
                }

                columns = pfm.trim().split(/\s+/);
                if(columnCount !== -1 && columns.length !== columnCount) {
                    error = 'Error in line ' + lineCount + '. Expected ' + columnCount + ' columns, but saw ' + columns.length + '.';
                } else {
                    columnCount = columns.length;
                    // check numbers
                    for (m = 0; m < columnCount; m++) {
                        if (isNaN(columns[m])) {
                            error = `Element ${m + 1} (${columns[m]}) in line ${lineCount} is not a valid number.`;
                            resolve(error);
                            return false;
                        }
                    }
                }
            }

            if (last) {
                resolve(error);
            }
            return true;
        });
    });
}

module.exports = function validate(file) {
    const errUnkonwn = 'Unknown filetype. Please see help for supported file types.';
    const suffix = ' Is the file type ' + file.type + ' correct?';

    switch(file.type) {
        case 'alignment':
            return validateAlignment(file.path).then((error) => {
                return error !== '' ? (error + suffix) : '';
            });
        case 'fasta':
            return validateFasta(file.path).then((error) => {
                return error !== '' ? (error + suffix) : '';
            });
        case 'pwm':
            return validatePWM(file.path).then((error) => {
                return error !== '' ? (error + suffix) : '';
            });
        case 'pfm':
            return validatePFM(file.path).then((error) => {
                return error !== '' ? (error + suffix) : '';
            });
        case 'homer':
            return validateHomer(file.path).then((error) => {
                return error !== '' ? (error + suffix) : '';
            });
        case 'jaspar':
            return validateJaspar(file.path).then((error) => {
                return error !== '' ? (error + suffix) : '';
            });
        default:
            logger.log('debug', 'validate - unknow filetype - %s', errUnkonwn);
            return Promise.resolve(errUnkonwn);
    }
};
