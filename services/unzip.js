/**
 * Used by Editor unzip
 */

exports.async = true;

exports.run = function (params, callback) {
	var args = params.body ? JSON.parse(params.body.params) : params;

	var path = require("path");
	var fs = require('fs');
	var archiver =require("archiver");
	var unzip =require("unzip2");

	// var targetURL = args.targetURL;

	var zipPath = global.httpPath + args.zipPath;

	//- uses arg dest path if provided else uses parent dir of zipPath.
	var destPath = args.dest ? global.httpPath + args.dest : path.resolve(path.dirname(zipPath));

	if (fs.existsSync(zipPath)) {
		fs.createReadStream(path.resolve(zipPath))
			.pipe( unzip.Extract({ path: destPath }))
			.on('close', function(){ 
				var macZipFolderPath = destPath + "/__MACOSX";
				if (fs.existsSync(macZipFolderPath)){
					//console.log("destroy__MACOSX", deleteRecursiveSync)	
					deleteRecursiveSync(macZipFolderPath);
				}		
				fs.unlinkSync(zipPath);
			});
	}
	
  	return true;


  	function deleteRecursiveSync(itemPath) {
    	if (fs.statSync(itemPath).isDirectory()) {
        	var folderContents=fs.readdirSync(itemPath)
        	for (var i=0; i<folderContents.length; i++){
        		deleteRecursiveSync(path.join(itemPath, folderContents[i]));
        	}
        	console.log("delete folder", itemPath)
    	    fs.rmdirSync(itemPath);
    	} else {
    		console.log("delete file", itemPath)
    		fs.unlinkSync(itemPath);
		}
	}
};
