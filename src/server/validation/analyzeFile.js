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

function analyzeAlignment(file) {
    logger.log('debug', 'Validating alignment: %s', file.path);
    file.parsingError = '';

    return new Promise((resolve) => {
        var length = -1;
        var row = 0;
        var sampleSize = 0;

        lineReader.eachLine(file.path, (line, last) => {
            // in an alignment file there can be scores
            var tfbs = line.split('\t')[0].trim();

            row++; sampleSize++;
            if(length === -1) {
                length = tfbs.length;
            }

            if(tfbs.length === 0) {
                sampleSize--;
                // empty line, do nothing
            } else if(length !== tfbs.length) {
                file.parsingError = getLineLengthError(row, file.path);
                logger.log('debug', 'analyzeAlignment - line length error -%s', file.parsingError);
                resolve(file);
                return false;
            } else if(!tfbs.match(/^[A-Za-z\-]+$/)) {
                file.parsingError = getUnkownSymbolError(row, file.path);
                logger.log('debug', 'analyzeAlignment - character error -%s', file.parsingError);
                resolve(file);
                return false;
            }

            if (last) {
                file.sampleSize = sampleSize;
                resolve(file);
            }
            return true;
        });
    });
}

function analyzeFasta(file) {
    logger.log('debug', 'Validating fasta: %s', file.path);
    file.parsingError = '';

    return new Promise((resolve) => {
        var length = -1;
        var row = 0;
        var tfbs = '';
        var sampleSize = 0;

        lineReader.eachLine(file.path, (line, last) => {
            line = line.trim();

            row++;

            if (line.length > 0) {
                if (line.startsWith('>') || line.startsWith(';')) {
                    if(tfbs.length > 0) {
                        sampleSize ++;
                        logger.log('debug', '%d: %s', row, tfbs);
                        if(length === -1) {
                            length = tfbs.length;
                        }
                        if(length !== tfbs.length) {
                            file.parsingError = getLineLengthError(row - 1, file.path);
                            logger.log('debug', 'analyzeFasta - line length error - %s', file.parsingError);
                            resolve(file);
                            return false;
                        } else if(!(/^[A-Za-z\-]+$/).test(tfbs)) {
                            file.parsingError = getUnkownSymbolError(row, file.path);
                            logger.log('debug', 'analyzeFasta - character error -%s', file.parsingError);
                            resolve(file);
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
                    file.parsingError = getLineLengthError(row - 1, file.path);
                    logger.log('debug', 'analyzeFasta - line length error - %s', file.parsingError);
                }
                file.sampleSize = sampleSize;
                resolve(file);
            }
            return true;
        });
    });
}

function analyzePWM(file) {
    logger.log('debug', 'Validating PWM: %s', file.path);
    file.parsingError = '';

    return new Promise((resolve) => {
        var pwm = [];
        var lineCount = 0;
        var columnCount = -1;
        var m = 0;
        var totalColumns = 0;
        var columnSum = 0;

        lineReader.eachLine(file.path, (line, last) => {
            var lineSplits = line.trim().match(/\S+/g);
            var splitCount = lineSplits === null ? 0 : lineSplits.length;

            lineCount++;

            if (columnCount > -1 && columnCount !== splitCount) {
                file.parsingError = getLineLengthError(lineCount, file.path);
                logger.log('debug', 'analyzePWM - line length error - %s', file.parsingError);
                resolve(file);
                return false;
            }

            for (m = 0; m < splitCount; m++) {
                if (isNaN(lineSplits[m])) {
                    file.parsingError = `Element ${m + 1} in line ${lineCount} is not a valid number.`;
                    logger.log('debug', 'analyzePWM - NAN error - %s', file.parsingError);
                    resolve(file);
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
                        file.parsingError = `Elements in column ${m + 1} sum not to 1.0 (${columnSum})`;
                        logger.log('debug', 'analyzePWM - sum error - %s', file.parsingError);
                        resolve(file);
                        return false;
                    }
                }
            }
            if (last) {
                resolve(file);
            }
            return true;
        });
    });
}

function analyzePFM(file) {
    logger.log('debug', 'Validating PFM: %s', file.path);
    file.parsingError = '';

    return new Promise((resolve) => {
        var alphabet = [];
        var lineCount = 0;
        var globalSplitCount = -1;
        var columnSum = 0;

        lineReader.eachLine(file.path, (line, last) => {
            var lineSplits = line.trim().match(/\S+/g);
            var splitCount = lineSplits === null ? 0 : lineSplits.length;
            var m = 0;

            lineCount++;

            if (globalSplitCount > -1 && globalSplitCount !== splitCount) {
                file.parsingError = getLineLengthError(lineCount, file.path);
                logger.log('debug', 'analyzePFM - line length error - %s', file.parsingError);
                resolve(file);
                return false;
            }

            // try parsing all numbers
            for (; m < splitCount; m++) {
                if (isNaN(lineSplits[m])) {
                    file.parsingError = `Element ${m + 1} in line ${lineCount} is not a valid number.`;
                    logger.log('debug', 'analyzePFM - NAN error - %s', file.parsingError);
                    resolve(file);
                    return false;
                }
            }

            globalSplitCount = splitCount;
            alphabet.push(lineSplits);
            if (last) {
                for (m = 0; m <= globalSplitCount; m++) {
                    columnSum = getSumForPwmColumn(alphabet, m);
                    if (columnSum < 1) {
                        file.parsingError = `At least one element in column ${m + 1} must be larger than 0.`;
                        logger.log('debug', 'analyzePFM - sum error - %s', file.parsingError);
                        resolve(file);
                        return false;
                    }
                }
            }
            if (last) {
                resolve(file);
            }
            return true;
        });
    });
}

function analyzeHomer(file) {
    logger.log('debug', 'Validating Homer: %s', file.path);
    file.parsingError = '';

    return new Promise((resolve) => {
        var lineCount = 0;
        var globalSplitCount = -1;

        lineReader.eachLine(file.path, (line, last) => {
            var lineSplits = line.trim().match(/\S+/g);
            var splitCount = lineSplits === null ? 0 : lineSplits.length;
            var m = 0;

            lineCount++;

            if (lineCount === 1) {
                if(!line.startsWith('>')) {
                    file.parsingError = 'First line must start with ">"';
                    logger.log('debug', 'analyzeJaspar - first line error - %s', file.parsingError);
                    resolve(file);
                    return false;
                }
            }
            if (globalSplitCount > -1 && globalSplitCount !== splitCount) {
                file.parsingError = getLineLengthError(lineCount, file.path);
                logger.log('debug', 'analyzeHomer - line length error - %s', file.parsingError);
                resolve(file);
                return false;
            }

            // try parsing all numbers
            if(splitCount > 0 && !line.startsWith('>')) {
                for (; m < splitCount; m++) {
                    if (isNaN(lineSplits[m])) {
                        file.parsingError = `Element ${m + 1} in line ${lineCount} is not a valid number.`;
                        resolve(file);
                        return false;
                    }
                }
            }
            if (last) {
                resolve(file);
            }
            return true;
        });
    });
}

function analyzeJaspar(file) {
    logger.log('debug', 'Validating Jaspar: %s', file.path);
    file.parsingError = '';

    return new Promise((resolve) => {
        var lineCount = 0;
        var columnCount = -1;
        var m = 0;
        var pfm = '';
        var columns;

        lineReader.eachLine(file.path, (line, last) => {
            lineCount++;

            if (lineCount === 1) {
                if(!line.startsWith('>')) {
                    file.parsingError = 'First line must start with ">"';
                    logger.log('debug', 'analyzeJaspar - first line error - %s', file.parsingError);
                    resolve(file);
                    return false;
                }
            } else {
                pfm = (/[ACGT]\s+\[(.*)\]/g).exec(line.trim())[1];
                if(pfm === null || pfm.length === 0) {
                    file.parsingError = 'Error in line ' + lineCount + '. "' + pfm + '" seem not to encoded nucleotide frequencies.';
                    logger.log('debug', 'analyzeJaspar - no numbers error - %s', file.parsingError);
                    resolve(file);
                    return false;
                }

                columns = pfm.trim().split(/\s+/);
                if(columnCount !== -1 && columns.length !== columnCount) {
                    file.parsingError = 'Error in line ' + lineCount + '. Expected ' + columnCount + ' columns, but saw ' + columns.length + '.';
                } else {
                    columnCount = columns.length;
                    // check numbers
                    for (m = 0; m < columnCount; m++) {
                        if (isNaN(columns[m])) {
                            file.parsingError = `Element ${m + 1} (${columns[m]}) in line ${lineCount} is not a valid number.`;
                            resolve(file);
                            return false;
                        }
                    }
                }
            }

            if (last) {
                resolve(file);
            }
            return true;
        });
    });
}

module.exports = function analyze(file) {
    const errUnkonwn = 'Unknown filetype. Please see help for supported file types.';
    const suffix = ' Is the file type ' + file.type + ' correct?';

    switch(file.type) {
        case 'alignment':
            return analyzeAlignment(file).then(() => {
                file.analyzed = true;
                file.parsingError = file.parsingError !== '' ? (file.parsingError + suffix) : '';
                return Promise.resolve(file);
            });
        case 'fasta':
            return analyzeFasta(file).then(() => {
                file.analyzed = true;
                file.parsingError = file.parsingError !== '' ? (file.parsingError + suffix) : '';
                return Promise.resolve(file);
            });
        case 'pwm':
            return analyzePWM(file).then(() => {
                file.analyzed = true;
                file.parsingError = file.parsingError !== '' ? (file.parsingError + suffix) : '';
                return Promise.resolve(file);
            });
        case 'pfm':
            return analyzePFM(file).then(() => {
                file.analyzed = true;
                file.parsingError = file.parsingError !== '' ? (file.parsingError + suffix) : '';
                return Promise.resolve(file);
            });
        case 'homer':
            return analyzeHomer(file).then(() => {
                file.analyzed = true;
                file.parsingError = file.parsingError !== '' ? (file.parsingError + suffix) : '';
                return Promise.resolve(file);
            });
        case 'jaspar':
            return analyzeJaspar(file).then(() => {
                file.analyzed = true;
                file.parsingError = file.parsingError !== '' ? (file.parsingError + suffix) : '';
                return Promise.resolve(file);
            });
        default:
            logger.log('debug', 'analyze - unknow filetype - %s', errUnkonwn);
            file.analyzed = true;
            file.parsingError = errUnkonwn;
            return Promise.resolve(file);
    }
};
