/**
 * Used by Editor.js createDir
 */

exports.async = true;

exports.run = function (params, callback) {
	var args = params.body ? JSON.parse(params.body.params) : params;
	
	var path = require("path");
	var fs = require('fs-extra');

	var dirURL = (global.httpPath + args["dirURL"]).trim();
	console.log(dirURL);

	if (dirURL.search(global.httpPath) == -1 || dirURL == global.httpPath) {
		console.log("create dir out of root dir is not allowed");
		callback({success: false});
		return false;
	}
	else{
		fs.mkdirsSync(dirURL);
		callback({success: true});
	}
	
	return true;
	
};
