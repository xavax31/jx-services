/**
 * Used by Editor.js download (direct link only, window.location = "/services/download?prefixZip=...)
 */
exports.headersent=true;

var fs = require('fs');

/**
 * Download file or directory. Directories are returned as zip archive.
 * @param  {string} params.url - url relative to root to download. File or Directory.
 * @param  {string} params.prefixZip - if url is a directory, this prefix will be had to zip name.
 * @param  {string} params.internPath - if url is a directory, create an arborescence in downloaded zip file. If internPath="" (default), the dir is copied at the root of the zip file.
 * @param  {boolean} params.date - add current date at end of downloaded file name.
 */
exports.run = function (params, callback) {
	var args;
	if (params.req) {
		args = {
			url: params.req.url,
			resNode: params.res
		}	
	}
	else {
		console.error("download script need node res in argument params")
	}

	var express = require('express');
	var url = require('url');
	var router = express.Router();
	var path = require("path");
	var zip = require("./zip-script");
	

	var url_parts = url.parse(args.url, true);
	console.log("url_parts",url_parts)
	//console.log(url_parts.query["filepath"]);
	var relativefilepath=url_parts.query["filepath"];
	var requested_url = url_parts.query["url"];
	var prefixZip = url_parts.query["prefixZip"];
	var date = url_parts.query["date"];
	var directoryZipInternPath = url_parts.query["internPath"] || "";
	
	if (requested_url==undefined) {
		console.log ("download/url=  is undefined");
		args.resNode.end();
		return;
	}

	requested_url = global.getDirShortcut(requested_url);

	var filename= path.basename(requested_url);
	var filepath = global.httpPath+"/"+ (requested_url.replace(global.httpPath, ""));

	if (fs.existsSync(filepath)) {	
		console.log("filepath found", filepath);

		if (fs.statSync(filepath).isDirectory()) {
			zip.zipFolder({dirPath: filepath, id: filename, prefixZip: prefixZip, internPath: directoryZipInternPath, date: date}, function(result){
				console.log(result, result.fileURL)
				_sendFile(args.resNode, result.fileName, result.fileURL, true);
			})
		}
		else {
			_sendFile(args.resNode, prefixZip + "_" + filename, filepath, false);
		}

    } else {
	    console.log("file Name  DOES NOT EXIST :"+filepath);
		args.resNode.end();
    }
	
  return true;
};

function _sendFile(res, filename, filepath, deleteAfterDownload){
	res.setHeader('Content-disposition', 'attachment; filename='+filename);
	res.setHeader("content-type", "application/download");
	console.log("_sendfile", filepath)
	var stream = fs.createReadStream(filepath)

	var had_error = false;
	stream.on('open', function () {
		stream.pipe(res);
	});
	
	stream.on('error', function(err) {
		had_error = true;
	});
	
	stream.on('close', function() {
		if (deleteAfterDownload) {
			fs.unlink(filepath, evt=>{} ); // delete zip after download
		};
		res.end();
	});

}
