
/**
 * Open file with default OS application.
 * Used by Editor openFile
 */

exports.async = true;

var fs = require('fs');
var path = require("path");
var open = require('open');

exports.run = function (params, callback) {
	var args = params.body ? JSON.parse(params.body.params) : params;

	console.log("openFile", args);
	var filePath = path.join(global.httpPath, args.url);

	if (fs.existsSync(filePath)) {
		open(path.join(global.httpPath, args.url));
		callback({success:true});
	}
	else{
		callback({success:false});
	}

	return true;
}