/**
 * Used by Editor listVersions
 * @type {[type]}
 */
var fs = require('fs');
var path = require('path');
exports.async = true;

exports.run = function (params, callback) {
	var args = params.body ? JSON.parse(params.body.params) : params;

	var bobaPath = global.httpPath + global.getDirShortcut("$bobaLastRelease"); 
	
	callback({success: true, versions: getDirectories(bobaPath)})
	return true;
}

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}