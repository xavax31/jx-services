/**
 * Used by Editor createNewProject
 */
exports.async = true;
		
var fs = require('fs-extra');
var exec = require('child_process').exec;
var path = require("path");
var Cloner = require("./copy-folder");


exports.run = function (params, callback) {
	var args = params.body ? JSON.parse(params.body.params) : params;
	console.log(args)

	var bobaFrameworkPath = global.httpPath + global.getDirShortcut("$bobaLastRelease");
	var projectsPath = global.httpPath + args.urlDest;
	var testPath = global.httpPath + "/builds";
	var gitOptions = args.git || null;


	var modelURL = global.httpPath + args.modelData.url;
	var destURL = projectsPath + "/" + args.idNewProject;

	//--- Copy directory
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

	Cloner.cloneRep(paramsCloneProject, modelURL, destURL);

	//--- edit editor.json

	var editorJSONURL = destURL + "/etc/editor/editor.json";
	var editorContent = 	JSON.parse(fs.readFileSync(editorJSONURL, 'utf8'));

	if(editorContent.ProjectInformations){ // Project type 1 format
		editorContent.ProjectInformations.id = args.idNewProject;
	}
	else if(editorContent.projectData){ // Project type 2 format
		for (var i = 0; i < editorContent.projectData.length; i++) {
			if (editorContent.projectData[i].id == "Informations") {
				for (var j = 0; j < editorContent.projectData[i].children.length; j++) {
					if (editorContent.projectData[i].children[j].id == "project") {
						editorContent.projectData[i].children[j].value.id = args.idNewProject;
						editorContent.projectData[i].children[j].value.status = "new";
					}
				};
			};
		};
	}

	editorContent = JSON.stringify(editorContent, null, 4);
	fs.writeFileSync(editorJSONURL, editorContent);


	
	if (gitOptions) { 
		//--- git management. Create a new bare reporsitory in /_repositories and link it to new project.
		// process first needed add, commit, push, pull.
		var repositoriesPath = path.join(global.httpPath, "_repositories", args.urlDest, args.idNewProject);
		fs.mkdirsSync(repositoriesPath);
		var scriptsPath = path.join(global.httpPath, global.getDirShortcut("$bobaLastRelease"), "scripts");
		var command = "./new_project.sh -l " + destURL + " -r " + repositoriesPath;
		var commandline = "osascript -e 'tell application \"Terminal\" to do script \"cd "+scriptsPath+"; ./"+command+"\"'"; 

		var script = exec(commandline , function(error, stdout, stderr){
			console.log(error, stdout, stderr); 
			callback({success: true, error:error, stdout: stdout, stderr:stderr}); 
		});
	}
	else {
		callback({success: true});
	}

	return true;

};
