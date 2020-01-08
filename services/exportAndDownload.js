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
	var bobaFrameworkPath = global.httpPath + global.getDirShortcut("$bobaLastRelease");
	var projectsPath = global.httpPath + "/projects";
	var testPath = global.httpPath + "/builds";

	var projectRelativePath = args.filename.replace("/projects/","");
	console.log(args.filename, projectsPath)
console.log("prp", projectRelativePath, projectsPath  +"/"+ projectRelativePath);
//return true;
	Exporter.publish({
		type: "Mix",
		bobaFrameworkPath : bobaFrameworkPath,
		sourcePath : projectsPath + "/" + projectRelativePath+"/public",
		targetPath : testPath + "/" + projectRelativePath,
	});
	     

	
  	return true;
};
