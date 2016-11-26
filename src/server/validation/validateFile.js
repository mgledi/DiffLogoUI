/* eslint-disable no-var */

var logger = require('winston');
var lineReader = require('line-reader');
var path = require('path');
logger.level = process.env.LOG_LEVEL || 'info';

function validateAlignment(filePath) {
    logger.log('debug', 'Validating alignment: %s', filePath);

    return new Promise((resolve) => {
        var length = -1;
        var error = '';
        var row = 0;

        lineReader.eachLine((line, last) => {
            // in an alignment file there can be scores
            var tfbs = line.split('\t')[0];

            row++;
            if(length === -1) {
                length = tfbs.length;
            } else if(tfbs.length === 0) {
                // do nothing
            } else if(length !== tfbs.length) {
                error = 'Error in line ' + row + '. All lines in ' + path.basename(filePath) + ' must have the same length!';
                logger.log('debug', error);
                resolve(error);
                return false;
            }

            if (last) {
                resolve();
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

        lineReader.eachLine((line, last) => {
            row++;

            if(line.trim().length === 0) {
                // do nothing
            } else if (line.startsWith('>') || line.startsWith(';')) {
                if(tfbs.length > 0) {
                    logger.log('debug', '%d: %s', row, tfbs);
                    if(length === -1) {
                        length = tfbs.length;
                    } else if(length !== tfbs.length) {
                        error = 'Error in line ' + (row - 1) + '. All lines in ' + path.basename(filePath) + ' must have the same length!';
                        logger.log('debug', error);
                        resolve(error);
                        return false;
                    }
                }

                tfbs = '';
            } else {
                // concatenate tfbs
                tfbs += line.trim();
            }
        });

        if (last) {
            resolve();
        }
    });
}

function validatePWM(filePath) {
    logger.log('debug', 'Validating PWM: %s', filePath);

    return new Promise((resolve) => {
        var data = [];
        var alphabetSize;
        var motifLength;

        lineReader.eachLine.on((line, last) => {
            data.push(line.trim().split('\t'));

            if (last) {
                var error = '';
                var alphabetSize = data.length;
                var motifLength = data[0].length;
                var m = 0, a = 0, val, sum;

                for(; m < motifLength; m++) {
                    sum = 0;
                    a = 0;
                    for(; a < alphabetSize; a++) {
                        val = Number(data[a][m]);
                        if(isNaN(val)) {
                            error = 'Element ' + m + ' in line ' + a + ' is not a valid number.';
                            logger.log('debug', error);
                            resolve(error);
                        } else {
                            sum += val;
                        }
                    }

                    if (Math.abs(1 - sum) > 0.000001) {
                        error = `Elements in column ${m} sum not to 1.0. (${sum})`;
                        logger.log('debug', error);
                        resolve(error);
                    }
                }

                resolve(error);
            }
        });
    });
}

module.exports = function validate(file) {

    switch(file.type) {
        case 'alignment':
            return validateAlignment(file.path);
        case 'fasta':
            return validateFasta(file.path);
        case 'pwm':
            return validatePWM(file.path);
        default:
            return Promise.resolve('Unknown filetype. Please see help for supported file types');
    }
}
