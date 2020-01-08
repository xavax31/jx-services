/**
 * Used by Editor zip
 */

exports.async = true;

exports.run = function (params, callback) {
	var args = params.body ? JSON.parse(params.body.params) : params;

	var path = require("path");
	var fs = require('fs');
	var zip = require("./zip-script");

	var filepath = global.httpPath + "/" + (args.url.replace(global.httpPath, "").replace(/^\//, ""));
	var filename= path.basename(args.url);
	var internPath = args.internPath || "";
	var prefixZip = args.prefixZip || "";
	var date = args.date;

	console.log("ZIP : ", filepath, filename, prefixZip, date, args.url);

	zip.zipFolder({dirPath: filepath, id: filename, prefixZip: prefixZip, internPath: internPath, date: date}, function(result){
		console.log(result, result.fileURL);
		callback(result);
	})


  	return true;
};
