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

	var filePath = path.resolve(global.httpPath, args["fileURL"].replace(/^\//, ""));

	if (isAllowedFile(filePath)) {
		console.log("deleteFile", filePath);
		fs.remove(filePath, err => {
			if (err){
				callback({success: false, err});
			}
			else {
				callback({success: true});
			}
		})
	}
	else{
		let errMessage = "Remove file outside of root dir is not allowed : " +  filePath;
		console.log(errMessage);
		callback({success: false, err: errMessage});
	}
	
	return true;
};

function isAllowedFile(filePath) {
	if (filePath.search(global.httpPath) == -1 || filePath == global.httpPath) {
		return false;
	}
	else {
		return true;
	}
}
