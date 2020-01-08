/**
 * Not used
 */

exports.async = true;

exports.run = function (params, callback) {
	console.log("run build", params)
	
	var path = require("path");
	var fs = require('fs');
	var babel = require("babel-core");
	console.log("run build2", global.httpPath+params.body.filename)

	babel.transformFile(global.httpPath+params.body.filename, {}, function (err, result) {
		console.log("ERR", err);
	  	console.log(result); // => { code, map, ast }
	  	callback({code: result.code || null, error: err});
	});


  return true;
};
