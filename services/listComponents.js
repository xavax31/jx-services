/**
 * Not used
 */

exports.async = true;

exports.run = function (params, callback) {
	var args = params.body;
	var refererDir = params.referer.pathDir;

	var path = require("path");
	var fs = require('fs');
	var url = args.url;
	console.log("listdir1", url)
	if (url.search(/^\//) != -1) {
		var filePath = path.normalize(global.httpPath + url);
		console.log("filePath1", filePath)
	}else{
		var filePath = path.resolve(refererDir, url)
		console.log("filePath2", filePath)

	}
	
	console.log("listComponents " + filePath , fs.readdir)
	
	fs.readdir(filePath, function(err, items) {
	    console.log(err);
	    console.log(items);

	 	var components = [];

	    for (var i=0; i<items.length; i++) {
	        console.log(items[i]);
	        var pathItem = path.resolve(filePath, items[i]);
	        var stats = fs.statSync(pathItem);
	        if (stats.isDirectory()) {

	        }
	        else{
				components.push({name: items[i], path: pathItem});
	        }
	    }

	    callback({items: components});
	    
	});
	     
  	return true;
};
