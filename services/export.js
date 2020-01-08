/**
 * No more used (now coded in ApplicationBabelHTML5, Base,... buildProjectIntern...)
 * @type {Boolean}
 */
exports.async = true;

exports.run = function (params, callback) {
	var args = params.body;

	var path = require("path");
	var fs = require('fs');

	var Exporter = require("./exporter/exporter");

	var typeExport = args.typeExport;
	var sourcePath = args.filename; // relative root server url beginning by "/"
	
	var bobaFrameworkPath = global.httpPath + global.getDirShortcut("$bobaLastRelease");
	var projectsPath = global.httpPath + "/projects";
	var testPath = global.httpPath + "/builds";
	var projectRelativePath = args.filename.replace("/projects/","");
	console.log(args.filename, projectsPath)
	//console.log("prp", projectRelativePath, projectsPath  +"/"+ projectRelativePath);

	Exporter.publish({
		type: typeExport,
		bobaFrameworkPath : bobaFrameworkPath,
		sourcePath : global.httpPath + sourcePath + "/public",
		targetPath : testPath +  sourcePath,
	});
	    callback({success:true, targetURL: "/builds" + sourcePath});
  	return true;
};
