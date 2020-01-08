exports.async = true;

exports.run = function (params, callback) {

	var fs = require('fs-extra');
	var execbash = require('./test');
	
	var args = JSON.parse(params.body.params);
	var dirProjects = global.httpPath;
	console.log("CLEANUP", args, dirProjects)

	execbash.run({testy: "whaou"}, function(result) {
		console.log("result TEST", result);
		callback({fromCLEANPROJECT: result});

	})
	//callback({success:true, filePathArray:filePathArray})
	return true;
}