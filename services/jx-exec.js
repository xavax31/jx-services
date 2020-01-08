let path = require("path");
let fs = require('fs-extra');
let exec = require('child_process').exec;

function exec (commandline, callback) {

	let script = exec(commandline, function(error, stdout, stderr){
		console.log(error, stdout, stderr); 
		callback(error, stdout, stderr); 
	});
}

module.exports.exec = exec;
