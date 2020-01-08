/**
 * Not used
 */
exports.async = true;

exports.run = function (params, callback) {
	var args = params.body ? JSON.parse(params.body.params) : params;

	var path = require("path");
	var fs = require('fs');
	var archiver = require("archiver");


	var targetURL = global.httpPath + "/_temp" + args.sourcePath;

	var archive = archiver.create('zip', {});

	var output = fs.createWriteStream(global.httpPath + targetURL +".zip");
	archive.directory(global.httpPath + targetURL, args.id);

	output.on('close', function() {
	  console.log(archive.pointer() + ' total bytes');
	  console.log('archiver has been finalized and the output file descriptor has closed.');
	  callback({fileURL: targetURL +".zip"});
	});

	archive.on('error', function(err) {
	  throw err;
	});

	archive.pipe(output);
	archive.finalize();
		     
  	return true;
};
