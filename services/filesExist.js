/**
 * Used by Editor filesExist
 */

exports.async = true;

exports.run = function (params, callback) {
	var args = params.body ? JSON.parse(params.body.params) : params;

	var fs = require('fs');
	

	var publicPath = global.httpPath + args.projectPath; //"/projects/milan-presse/jeu-memory/public";
	var filePathArray=args.filePathArray;

	for ( var i=0; i<filePathArray.length; i++ ) {
		var path=publicPath+"/"+filePathArray[i].src;
		filePathArray[i].exists=fs.existsSync(path);
	}

	callback({success:true, filePathArray:filePathArray})
	return true;
}