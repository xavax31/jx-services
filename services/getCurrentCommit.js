/**
 * Use by Editor getCurrentCommit
 */
exports.async = true;

exports.run = function (params, callback) {
	var args = params.body ? JSON.parse(params.body.params) : params;

	var path = require("path");
	var fs = require('fs-extra');
	var exec = require('child_process').exec;
 
	var url = args.url || "$bobaLastRelease";

	url = global.getDirShortcut(url);
	console.log("getCurrentCommit.js",global.httpPath,  path.join(global.httpPath, url))

	 var result = {};
	 var cdToDirCommand = "cd " + path.join(global.httpPath, url) + ";";

	 var script = exec(cdToDirCommand + "git log --oneline --decorate -1", function(error, stdout, stderr){
	 	// 	console.log("r1", error, stdout, stderr); 
			// var script = exec("git log --oneline --decorate -1", function(error, stdout, stderr){
					console.log("r2", error, stdout, stderr); 
					var matches = stdout.match(/\(([^\)]*)\)/);
					result.branch = matches[1];
					var script = exec(cdToDirCommand + 'git log --pretty=format:"%h-%ad" -1', function(error, stdout, stderr){
							console.log("r3", error, stdout, stderr); 
							var matches = stdout.match(/^([^\-]*)-([^\-]*)/);
							result.commit = matches[1];
							result.date = matches[2];
							callback(result); 
						});
				// });
		});


  	return true;
};
