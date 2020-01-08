/**
 * Used by Editor.js deleteDir
 */

exports.async = true;

exports.run = function (params, callback) {
	var args = params.body ? JSON.parse(params.body.params) : params;

	var path = require("path");
	var fs = require('fs-extra');
	var Exporter = require("./exporter/exporter");
	var bobaFrameworkPath = global.httpPath + global.getDirShortcut("$bobaLastRelease");
	var projectsPath = global.httpPath + "/projects/tests";
	var testPath = global.httpPath + "/builds";

	var dirURL = (global.httpPath + args["dirURL"]).trim();
	console.log(dirURL);
	//return;
	if (dirURL.search(global.httpPath) == -1 || dirURL == global.httpPath) {
		console.log("Remove dir out of root dir is not allowed");
		callback({success: false});
		return false;
	}
	else{
		fs.removeSync(dirURL);
		callback({success: true});
	}
	
	return true;
	
};
