/**
 * Not used
 */

var fs = require('fs-extra');
var path = require("path");

var params;

function listFolder(p) {
	params=p;
	params.containsFile = params.containsFile || "";
	params.flat = params.flat || false;
	params.ext_exclude = params.ext_exclude || [];
	params.dossier_reg_exclude = params.dossier_reg_exclude || [];
	params.fichier_reg_exclude = params.fichier_reg_exclude || [];
	p.dirPath = global.httpPath + p.dirPath;
console.log("listFolder", p.dirPath);
	//setupTargetFolder(dest);
	if (p.flat) {
		return _list_folder_flat(p.dirPath);
	}
	else{
		return _list_folder(p.dirPath);
	}
	
}

function find(p) {
	return 'yo';
}

function _list_folder(dirPath, resultArr) {
	
	var firstLoop = (resultArr==undefined);
	resultArr = resultArr || [];

	var dirResult = {
		name: path.basename(dirPath),
		url: path.relative(global.httpPath, dirPath),
		path: dirPath,
		type: "directory",
		children:[]
	};
console.log("_list_folder", dirResult)
	var files = fs.readdirSync(dirPath);
	console.log(files)
	  files.forEach( function (file) {
    		var filebasename = path.basename(file);
    		var filePath = path.resolve(dirPath, filebasename);
    		console.log("child", filePath)
    		if(fs.lstatSync(filePath).isDirectory()) {
    			console.log("dir", file)
    			if(!isExcludedByExpression(file, params.dossier_reg_exclude)) {
    				//if (params.containsFile != undefined && fs.existsSync(path.resolve(filePath, params.containsFile))) {
    					console.log("dir2", file)
    					_list_folder(path.join(dirPath, filebasename), dirResult.children);
    				//}
    				//--- directory
    				//fs.mkdirsSync(path.resolve(dest, filebasename));
    				
    			}
    		} else {
    				//--- file
    				console.log("file", file)
				if((!isfileExtensionExcluded(file, params.ext_exclude)) && (!isExcludedByExpression(file, params.fichier_reg_exclude)))  {
  					//fs.writeFileSync(path.resolve(dest, filebasename), fs.readFileSync(path.resolve(dirPath,filebasename)));  	
  					dirResult.children.push({
  						type:"file",
  						name: filebasename
  					})
  				}
    		} 
	  });

	  resultArr.push(dirResult);
	  return resultArr;
	  //if (firstLoop) {};
}

function _list_folder_flat(dirPath, resultArr) {
	
	var firstLoop = (resultArr==undefined);
	resultArr = resultArr || [];

	var dirResult = {
		name: path.basename(dirPath),
		url: path.relative(global.httpPath, dirPath),
		path: dirPath,
		type: "directory"
	};
	resultArr.push(dirResult);
console.log("_list_folder", dirResult)
	var files = fs.readdirSync(dirPath);
	console.log(files)
	  files.forEach( function (file) {
    		var filebasename = path.basename(file);
    		var filePath = path.resolve(dirPath, filebasename);
    		console.log("child", filePath)
    		if(fs.lstatSync(filePath).isDirectory()) {
    			console.log("dir", file)
    			if(!isExcludedByExpression(file, params.dossier_reg_exclude)) {
    				//if (params.containsFile != undefined && fs.existsSync(path.resolve(filePath, params.containsFile))) {
    					console.log("dir2", file)
    					_list_folder_flat(path.join(dirPath, filebasename), resultArr);
    				//}
    				//--- directory
    				//fs.mkdirsSync(path.resolve(dest, filebasename));
    				
    			}
    		} else {
    				//--- file
    				console.log("file", file)
				if((!isfileExtensionExcluded(file, params.ext_exclude)) && (!isExcludedByExpression(file, params.fichier_reg_exclude)))  {
  					//fs.writeFileSync(path.resolve(dest, filebasename), fs.readFileSync(path.resolve(dirPath,filebasename)));  	
  					resultArr.push({
  						type:"file",
  						name: filebasename
  					})
  				}
    		} 
	  });

	  
	  return resultArr;
	  //if (firstLoop) {};
}

function isExcludedByExpression(file, folderExpressions) {
	var excluded=false;
	folderExpressions.forEach(function loop (expression) {
		if (loop.stop) { return; }
		if (expression.test(file)) {
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
		if(loop.stop) { return; }
		if(".".concat(extension) == path.extname(file)) {
			//console.log("excluded", file);
			 loop.stop = true; 
			 excluded=true;
		}
	})
	
	return excluded;
}

module.exports.listFolder = listFolder;
module.exports.find = find;


