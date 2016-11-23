/* eslint-disable no-var */

 var LineByLineReader = require('line-by-line')
 var path = require('path');

function validate(file) {

	if (file.type === 'alignment') {
		return validateAlignment(file.path);
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
			var tfbs = line.split("\t")[0];
			console.log(row + ": " + tfbs);
			if(length == -1) {
				length = tfbs.length
			} else if(tfbs.length == 0) {
				// do nothing
			} else if(length !== tfbs.length) {
				console.log("error occured");
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
	console.log(filePath);
	return "";
}

function validatePWM(filePath) {

}

module.exports = {
    validate: validate,
    validateAlignment: validateAlignment,
    validateFasta: validateFasta,
    validatePWM: validatePWM
};