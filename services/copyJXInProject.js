/**
 * Not used
 */

exports.async = true;

exports.run = function (params, callback) {
	var args = params.body;

	console.log("CopyJXInProject")
	var path = require("path");
	var fs = require('fs');
	var Exporter = require("./exporter/exporter");
	var Cloner = require("./copy-folder");

	var typeExport = args.typeExport || "Full";
	var pathFramework = args.pathFramework;
	var bobaFrameworkPath = global.httpPath + pathFramework;
	var projectsPath = global.httpPath + "/projects";
	var testPath = global.httpPath + "/_temp";
	var sourcePath = args.filename; // relative root server url beginning by "/"
	var projectRelativePath = args.filename.replace("/projects/","");
	console.log(pathFramework)

	Exporter.publish({
		type: typeExport,
		bobaFrameworkPath : bobaFrameworkPath,
		sourcePath : global.httpPath + sourcePath,
		targetPath : testPath +  sourcePath,
	});

	var paramsCloneProject = {
		date: false, // if true, date string is added in copy directory name
		ext_exclude: [],   // exclude files with these extensions
		fichier_reg_exclude: [],    // exclude files for wich name matches these regular expressions
		dossier_reg_exclude: [],     // exclude directories for wich name matches these regular expressions

		arbo_seule: false, // copy only directories, but no files
		ecrase_dossiers: true,  // erase dest dir if exists before copy, else copy on existing directory (good for patches)
		supprimer_fichiers_source: false, // delete ori dir after copy
		nb_recursif: 10000 // level of recursivity in directories
	}
	Cloner.cloneRep(paramsCloneProject, testPath + sourcePath, global.httpPath + sourcePath);

	callback({success:true, targetURL: "/builds" + sourcePath});
  	return true;
};
