/**
 * Used only by other node services
 */

//npm install exec-sync
var fs = require('fs-extra');
var path = require("path");
//var execSync = require('exec-sync');


function deleteFolderRecursiveSync(path) {
  if ( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursiveSync(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

function setupTargetFolder(destFolder) {
	//console.log(fs.existsSync(destFolder));
	if (fs.existsSync(destFolder) && params.ecrase_dossiers) {
		fs.removeSync(destFolder);
	};
	// if (fs.existsSync(destFolder) && params.ecrase_dossiers) {
	// 	execSync("rm -r " + destFolder);
	// }
	
	try { fs.mkdirsSync(destFolder); } catch(e) {
    	if ( e.code != 'EEXIST' ) throw e;
  	}
}

var params;
function cloneRep(p, ori, dest, callback) {
	console.log("copy", p, ori, dest)
	params=p;
	setupTargetFolder(dest);
	selectiveCopy(ori, dest);
	if (callback) callback();
}

function selectiveCopy(ori, dest) {
	var files = fs.readdirSync(ori);

	var stats=fs.lstatSync(ori);
	var chmod = String(parseInt(stats.mode.toString(8), 10)).substr(-4, 4);
	var group = stats.gid;

	fs.chmodSync(dest, chmod)
	fs.chownSync(dest, 0, group)

	  files.forEach( function (file) {
    		var filebasename = path.basename(file);
    		var stats=fs.lstatSync(path.resolve(ori, filebasename));
    		var chmod = String(parseInt(stats.mode.toString(8), 10)).substr(-4, 4);
    		var group = stats.gid;

    		if (stats.isDirectory()) {
    			if (!isExcludedByExpression(file, params.dossier_reg_exclude)) {
    				fs.mkdirsSync(path.resolve(dest, filebasename));
    				fs.chmodSync(path.resolve(dest, filebasename), chmod)
    				fs.chownSync(path.resolve(dest, filebasename), 0, group)
    				//console.log(path.join(dest, filebasename), path.join(ori, filebasename));
    					//console.log(ori, filebasename, dest, filebasename, path.join(ori, filebasename))

    				selectiveCopy(path.join(ori, filebasename), path.join(dest, filebasename));
    			}
    		} else {

				if ((!isfileExtensionExcluded(file, params.ext_exclude)) && (!isExcludedByExpression(file, params.fichier_reg_exclude)) && !params.arbo_seule)  {
  					fs.writeFileSync(path.resolve(dest, filebasename), fs.readFileSync(path.resolve(ori,filebasename))); 
  					fs.chmodSync(path.resolve(dest, filebasename), chmod); 	
  					fs.chownSync(path.resolve(dest, filebasename), 0, group)

  				}
    		} 
	  });
}

function isExcludedByExpression(file, folderExpressions) {
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

function isfileExtensionExcluded(file, excludedExtensions) {
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

module.exports.cloneRep = cloneRep;


