
var fs = require('fs-extra');
var path = require("path");
var Cloner = require("../../copy-folder");


function publish(params) {
	params.date == undefined ? false : params.date;
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

	var date = new Date();
	var dateStr = date.getFullYear()+ "-" + Number(date.getMonth()+1)+ "-" + date.getDate() + "-" + Number(date.getHours()+1) + "h" + Number(date.getMinutes()+1) + "m" + Number(date.getSeconds()+1) + "s" ;

	var sourcePath= params.sourcePath;
	var targetPath= params.targetPath + (params.date ? "_"+ dateStr : "");

	var bobaEnginePath = path.resolve(params.bobaFrameworkPath, "engine/build/jx") ;
	var bobaEngineLibPath = path.resolve(params.bobaFrameworkPath, "lib") ;

	console.log("Clone : " + sourcePath + "\nTO : " + targetPath)

	Cloner.cloneRep(paramsCloneProject, sourcePath, targetPath);
	Cloner.cloneRep(paramsCloneJX,  bobaEnginePath , path.resolve(targetPath, "public/js/jx"));
	Cloner.cloneRep(paramsCloneJXLibs,  bobaEngineLibPath , path.resolve(targetPath, "public/js/lib"));

	// if (fs.existsSync(path.resolve(sourcePath, "index_prod.html"))) {
	// 	fs.copySync(path.resolve(sourcePath, "index_prod.html") , path.resolve(targetPath, "index.html"));
	// };
	
	// if (fs.existsSync(path.resolve(sourcePath, "index_aquafadas.html"))) {
	// 	fs.copySync(path.resolve(sourcePath, "index_aquafadas.html") , path.resolve(targetPath, "index_aquafadas.html"));
	// };

	console.log("ok");
};


module.exports.publish = publish;


