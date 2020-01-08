/**
 * Not used
 */

exports.async = true;

exports.run = function (params, callback) {
	var args = params.body;

	var path = require("path");
	var fs = require('fs');
	var Exporter = require("./exporter/exporter");

	var dirs = {
		temp: global.httpPath + "/_temp" ,
		projects: global.httpPath + "/projects" ,
		test: global.httpPath + "/builds" ,
		bobaCurrent:  global.httpPath + global.getDirShortcut("$bobaLastRelease")
	}


	var typeExport = args.typeExport;
	var jxSource = args.jxSource;
	var projectData = JSON.parse(args.projectData); // relative root server url beginning by "/"
	
	console.log("buildProject", jxSource, projectData);

	var sourcePath = global.httpPath + projectData.url;
	var targetPath = dirs.temp + projectData.url + "_" + typeExport + "_";
	console.log("buildProject1",Exporter.publish);


	Exporter.publish({
		type: typeExport,
		jxSource: jxSource,
		bobaFrameworkPath : dirs.bobaCurrent,
		sourcePath : sourcePath + "/public",
		targetPath : targetPath
	});
	console.log("buildProject2");
	
	callback({success:true, targetURL: "/_temp" + projectData.url + "_" + typeExport + "_"});

  	return true;
};
