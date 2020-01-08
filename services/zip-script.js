/**
 * Used by services zip and download
 */
exports.async = true;

module.exports.zipFolder = function (params, callback) {
	var args = params;
	
	var path = require("path");
	var fs = require('fs');
	var archiver =require("archiver");

	var dirPath = args.dirPath; // dir to zip
	var prefixZip = args.prefixZip || ""; // prefix added to final filename
	var internPath = args.internPath || ""; // directories structure to create in zip. if = "", the directory dirPath is copied at the root of zip file

	var parentDirPath = path.dirname(dirPath);
	var zipName = prefixZip == "" ? args.id :  prefixZip;
	var addDate = args.date == "true" || false;

	if (addDate) {
		var date = new Date();
		var dateStr = date.getFullYear()+ "-" + g2d(Number(date.getMonth()+1))+ "-" + g2d(date.getDate()) + "-" + g2d(Number(date.getHours())) + "h" + g2d(Number(date.getMinutes())) + "m" + g2d(Number(date.getSeconds())) + "s" ;
		zipName += "_" + dateStr;
	}

	var zipFileName = zipName + ".zip";
	var zipPath = path.resolve(parentDirPath, zipFileName);


	var archive = archiver.create('zip', {});

	var output = fs.createWriteStream(zipPath);

	if (internPath == "") {
		archive.directory(dirPath, zipName );
	}
	else {
	 	archive.directory(dirPath, zipName + "/" + internPath);
	}

	output.on('close', function() {
	  	console.log(archive.pointer() + ' total bytes');
	  	console.log('archiver has been finalized and the output file descriptor has closed.');
	  	callback({fileName: zipFileName, fileURL: zipPath});
	});

	archive.on('error', function(err) {
	  	throw err;
	});

	archive.pipe(output);
	archive.finalize();
		     
  	return true;
};

function g2d(num) {
	if (num<10) {
		return "0" + num;
	}
	else {
		return num;
	}
}
