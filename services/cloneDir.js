/**
 * Used by Editor.js cloneDir
 */
exports.async = true;

//npm install exec-sync
var fs = require('fs-extra');
var path = require("path");
//var execSync = require('exec-sync');


/**
 * cloneDir
 * @param  {Object}   params   
 * @param  {Function} callback 
 * @(params, callback);example
 * 	var paramsCloneProject = {
 * 		sourcePath: ,
 * 		destPath: ,
 * 		options: {
 * 			date: false, // if true, date string is added in copy directory name
 * 			extExclude: [],   // exclude files with these extensions
 * 			fileExclude: [],    // exclude files for wich name matches these regular expressions
 * 			dirExclude: [],     // exclude directories for wich name matches these regular expressions
 * 			treeOnly: false, // copy only directories, but no files
 * 			merge: false,  // if false, erase dest dir if exists before copy, else merge in existing directory (good for patches)
 * 			deleteSource: false, // delete ori dir after copy
 * 			recursive: 10000 // level of recursivity in directories
 * 		}
 * }
 * @return {Object}
 */
function run(params, callback) {
	var args = params.body ? JSON.parse(params.body.params) : params;

	var sourcePath = args.sourcePath;
	var destPath = args.destPath;

	var options = {
		date: false,
		extExclude: [], 
		fileExclude: [],    
		dirExclude: [],     
		treeOnly: false,  
		merge: false, 
		deleteSource: false,
		recursive: 10000 
	};

	for (var prop in args.options){
		options[prop] = args.options[prop];
	}




	// replace dir shortcuts by corrects path
	var dirShortcuts = global.config.dirShortcuts;
	for (var prop in dirShortcuts) {
		sourcePath = sourcePath.replace("$" + prop, dirShortcuts[prop]);
		destPath = destPath.replace("$" + prop, dirShortcuts[prop]);
	};

	if (sourcePath.trim() == "" || destPath.trim() == "") {
		callback({success: false, mess: "Not Valide source or dest path. sourcePath: " + global.httpPath + sourcePath + ", destPath: " + global.httpPath + destPath});
		return false;
	}

	var absSourcePath = global.httpPath + (sourcePath.replace(global.httpPath, ""));
	var absDestPath = global.httpPath + (destPath.replace(global.httpPath, ""));


	//--- Copy directory
	console.log("CloneDir");
	console.log(options);
	console.log("Clone Directory ", sourcePath, "\nTO",  destPath);

	_cloneRep(absSourcePath, absDestPath, options, function(){
		console.log("Directory cloned");
		callback({success: true, destPath: destPath});
	});

	return true;

}


function _deleteDir(path) {
  	if ( fs.existsSync(path) ) {
  		fs.removeSync(path);
  		//execSync("rm -r " + path);
  	}
}

function _setupTargetFolder(destFolder, options) {
	//console.log(fs.existsSync(destFolder));
	
	if (!options.merge) {
		_deleteDir(destFolder);
	};
	
	try { fs.mkdirsSync(destFolder); } catch(e) {
    	if ( e.code != 'EEXIST' ) throw e;
  	}
}

function _cloneRep(ori, dest, options, callback) {
	console.log("OPTIONS", options)
	_setupTargetFolder(dest, options);
	_selectiveCopy(ori, dest, options);

	if (options.deleteSource) {
		console.log("DELETE", ori)
		_deleteDir(ori);
	};
	callback();
}

function _selectiveCopy(ori, dest, options) {
	var files = fs.readdirSync(ori);
	  files.forEach( function (file) {
    		var filebasename = path.basename(file);
    		var stats=fs.lstatSync(path.resolve(ori, filebasename));
    		var chmod = String(parseInt(stats.mode.toString(8), 10)).substr(-4, 4)

    		if (stats.isDirectory()) {
    			if (!_isExcludedByExpression(file, options.dirExclude)) {
    				fs.mkdirsSync(path.resolve(dest, filebasename));
    				fs.chmodSync(path.resolve(dest, filebasename), chmod)
    				//console.log(path.join(dest, filebasename), path.join(ori, filebasename));
    					//console.log(ori, filebasename, dest, filebasename, path.join(ori, filebasename))

    				_selectiveCopy(path.join(ori, filebasename), path.join(dest, filebasename), options);
    			}
    		} else {

				if ((!_isfileExtensionExcluded(file, options.extExclude)) && (!_isExcludedByExpression(file, options.fileExclude)) && !options.treeOnly)  {
  					fs.writeFileSync(path.resolve(dest, filebasename), fs.readFileSync(path.resolve(ori,filebasename))); 
  					fs.chmodSync(path.resolve(dest, filebasename), chmod); 	
  				}
    		} 
	  });
}

function _isExcludedByExpression(file, folderExpressions) {
	var excluded=false;
	folderExpressions.forEach(function loop (expression) {
		if (loop.stop) { return; }
		if (new RegExp(expression).test(file)) {
			 //console.log("excluded", file);
			 loop.stop = true; 
			 excluded=true;
		}
	})
	return excluded;
}

function _isfileExtensionExcluded(file, excludedExtensions) {
	var excluded=false;
	excludedExtensions.forEach(function loop (extension) {
		if (loop.stop) { return; }
		if (".".concat(extension) == path.extname(file)) {
			//console.log("excluded", file);
			 loop.stop = true; 
			 excluded=true;
		}
	})
	
	return excluded;
}

// module.exports.cloneDir = run;
module.exports.run = run;



