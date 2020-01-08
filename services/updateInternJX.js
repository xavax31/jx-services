/**
 * Used by Application(Babel)HTML5Base.updateInternJX
 */
exports.async = true;

/**
 * 
 * @param  {object}   params
 * @param  {string}   params.typeExport - default Full
 * @param  {string}   params.pathFramework - url of framework (relative root server url beginning by "/")
 * @param  {string}   params.filename - url of framework (relative root server url beginning by "/")
 * @param  {Function} callback 
 * @return {void}
 */
exports.run = function (params, callback) {
	var args = params.body ? JSON.parse(params.body.params) : params;

	console.log("updateInternJX")
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

	// Exporter.publish({
	// 	type: typeExport,
	// 	bobaFrameworkPath : bobaFrameworkPath,
	// 	sourcePath : global.httpPath + sourcePath,
	// 	targetPath : testPath +  sourcePath,
	// });

	var paramsCloneJX = {
		date: false, // if true, date string is added in copy directory name
		ext_exclude: ["fla", "as", "rtf", "zip", "as2proj", "pdf", "psd",  "txt", "bat", "rar", "dmg", "md"],   // exclude files with these extensions
		fichier_reg_exclude: [ /^index_/, /^.*_old/, /^.*_temp/ ],    // exclude files for wich name matches these regular expressions
		//dossier_reg_exclude: [/^(?!libs)$/, /^(?!src)$/ ],     // exclude directories for wich name matches these regular expressions
		 dossier_reg_exclude: [/^doc$/, /_sources_medias/, /\.git/,/^build$/ ,/^examples$/, /^templates$/,/^node_server$/, /^.*_old$/, /^.*_temp$/ ],     // exclude directories for wich name matches these regular expressions

		arbo_seule: false, // copy only directories, but no files
		ecrase_dossiers: true,  // erase dest dir if exists before copy, else copy on existing directory (good for patches)
		supprimer_fichiers_source: false, // delete ori dir after copy
		nb_recursif: 10000 // level of recursivity in directories
	}

	var paramsCloneJXLibs = {
		date: false, // if true, date string is added in copy directory name
		ext_exclude: ["fla", "as", "rtf", "zip", "as2proj", "pdf", "psd",  "txt", "bat", "rar", "dmg", "md"],   // exclude files with these extensions
		fichier_reg_exclude: [ /^index_/, /^.*_old/, /^.*_temp/ ],    // exclude files for wich name matches these regular expressions
		//dossier_reg_exclude: [/^(?!libs)$/, /^(?!src)$/ ],     // exclude directories for wich name matches these regular expressions
		 dossier_reg_exclude: [/^doc$/, /_sources_medias/, /\.git/,/^build$/ ,/^examples$/, /^templates$/,/^node_server$/, /^.*_old$/, /^.*_temp$/ ],     // exclude directories for wich name matches these regular expressions

		arbo_seule: false, // copy only directories, but no files
		ecrase_dossiers: false,  // erase dest dir if exists before copy, else copy on existing directory (good for patches)
		supprimer_fichiers_source: false, // delete ori dir after copy
		nb_recursif: 10000 // level of recursivity in directories
	}

	sourcePathAbs= global.httpPath + sourcePath;
	var targetPath= args.targetPath + (args.date ? "_"+ dateStr : "");

	var bobaEnginePath = path.resolve(bobaFrameworkPath, "engine/build/jx") ;
	var bobaEngineLibPath = path.resolve(bobaFrameworkPath, "lib") ;

	var childProcess = require('child_process');

	function runScript(scriptPath, scriptArgs, options, callback) {

	    // keep track of whether callback has been invoked to prevent multiple invocations
	    var invoked = false;

	    var process = childProcess.fork(scriptPath, scriptArgs, options);

	    // listen for errors as they may prevent the exit event from firing
	    process.on('error', function (err) {
	        if (invoked) return;
	        invoked = true;
	        callback(err);
	    });

	    // execute the callback once the process has finished running
	    process.on('exit', function (code) {
	        if (invoked) return;
	        invoked = true;
	        var err = code === 0 ? null : new Error('exit code ' + code);
	        callback(err);
	    });
	}
	
	console.log("Clone : " + bobaEnginePath + "\nTO : " + path.resolve(sourcePathAbs, "public/js/jx"))

	Cloner.cloneRep(paramsCloneJX,  bobaEnginePath , path.resolve(sourcePathAbs, "public/js/jx"));

	console.log("Clone : " + bobaEngineLibPath + "\nTO : " + path.resolve(sourcePathAbs, "public/js/lib"))
	
	Cloner.cloneRep(paramsCloneJXLibs,  bobaEngineLibPath , path.resolve(sourcePathAbs, "public/js/lib"));

	// package jx engine in jxengine.min.js
	runScript(global.httpPath + global.config.dirShortcuts.bobaLastRelease + '/engine/build/packaging/r.js',
	 ['-o', 'builder.js', 'out=' + path.resolve(sourcePathAbs, "public/js/lib/jx/jxengine.min.js")], 
	 {cwd:global.httpPath + global.config.dirShortcuts.bobaLastRelease + '/engine/build/packaging'}, function (err) {
	    if (err) throw err;

	    // Cloner.cloneRep(paramsCloneProject, bobaEnginePath, sourcePath + "/public/js/jx");

	    callback({success:true, targetURL: "/builds" + sourcePath});

	    console.log('finished running some-script.js');
	});

	// callback({success:true, targetURL: "/builds" + sourcePath});
	

  	return true;
};
