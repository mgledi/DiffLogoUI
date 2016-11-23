/* eslint-disable no-var */

 var LineByLineReader = require('line-by-line')
 var path = require('path');

function validate(file) {

	if (file.type === 'alignment') {
		return validateAlignment(file.path);
	} else if (file.type === 'fasta') {
		return validateFasta(file.path);
	} else {
		return Promise.resolve('Unkown filetype');
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
				lr.close();
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
						console.log("error occured");
						error = "Error in line " + (row-1) + ". All lines in " + path.basename(filePath) + " must have the same length!";
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

}

module.exports = {
    validate: validate,
    validateAlignment: validateAlignment,
    validateFasta: validateFasta,
    validatePWM: validatePWM
};