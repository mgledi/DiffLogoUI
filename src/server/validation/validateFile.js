/* eslint-disable no-var */

 var LineByLineReader = require('line-by-line')
 var path = require('path');

function validate(file) {

    if (file.type === 'alignment') {
        return validateAlignment(file.path);
    } else if (file.type === 'fasta') {
        return validateFasta(file.path);
    } else if (file.type === 'pwm') {
        return validatePWM(file.path);
    } else {
        return Promise.resolve('Unkown filetype. Please see help for supported file types.');
    }
}

/**
 *
 */ 
function validateAlignment(filePath) {
    console.log("Validating alignment: " + filePath);
    return new Promise((resolve, reject) => {
        var lr = new LineByLineReader(filePath);

        var length = -1;
        var error = "";
        var row = 0;
        lr.on('line', function(line) {
            row++;
            // in an alignment file there can be scores
            var tfbs = line.split("\t")[0];
            if(length == -1) {
                length = tfbs.length
            } else if(tfbs.length == 0) {
                // do nothing
            } else if(length !== tfbs.length) {
                error = "Error in line " + row + ". All lines in " + path.basename(filePath) + " must have the same length!";
                console.log(error);
            }
        });
        
        lr.on("end",function (){
            resolve(error);
        });

    }); 
}

function validateFasta(filePath) {
    console.log("Validating fasta: " + filePath);
    return new Promise((resolve, reject) => {
        var lr = new LineByLineReader(filePath);

        var length = -1;
        var error = "";
        var row = 0;
        var tfbs = "";
        lr.on('line', function(line) {
            row++;
            if(line.trim().length == 0) {
                // do nothing
            } else if( line.startsWith(">") || line.startsWith(";") ) {
                if(tfbs.length > 0) {
                    console.log(row + ": " + tfbs + " ");
                    if(length == -1) {
                        length = tfbs.length;
                    }  else if(length !== tfbs.length) {
                        error = "Error in line " + (row-1) + ". All lines in " + path.basename(filePath) + " must have the same length!";
                        console.log(error);
                    }
                }
                tfbs = "";
            } else {
                // concatenate tfbs
                tfbs += line.trim();
            }
        });
        
        lr.on("end",function (){
            resolve(error);
        });

    }); 
}

function validatePWM(filePath) {
console.log("Validating PWM: " + filePath);
    return new Promise((resolve, reject) => {
        var data = [];
        var lr = new LineByLineReader(filePath);
        var motifLength = -1;
        lr.on('line', function(line) {
            data.push(line.trim().split("\t"));
        });

        lr.on("end",function (){
            var error = "";
            var alphabetSize = data.length;
            var motifLength = data[0].length;
            for(var m=0; m < motifLength; m++) {
                var sum = 0;    
                for(var a=0; a < alphabetSize; a++) {
                    var val = Number(data[a][m]);
                    if(isNaN(val)) {
                        error = "Element " + m + " in line " + a + " is not a valid number.";
                        resolve(error);
                    } else {
                        sum += val;
                    }
                }   
                if( Math.abs(1 - sum) > 0.000001 ) {
                    error = "Elements in row " + m + " sum not to 1.0.";
                    resolve(error);
                }
            }

            resolve(error);
        });
    }); 
}

module.exports = {
    validate: validate,
    validateAlignment: validateAlignment,
    validateFasta: validateFasta,
    validatePWM: validatePWM
};