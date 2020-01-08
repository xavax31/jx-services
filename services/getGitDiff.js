/**
 * Used by Editor getGitDiff
 */

exports.async = true;

exports.run = function (params, callback) {
	var args = params.body ? JSON.parse(params.body.params) : params;

	var path = require("path");
	var fs = require('fs-extra');
	var exec = require('child_process').exec;
 
	var url = args.url || "$bobaLastRelease";
	var date = args.date;
	// var commit1 = args.commit1;
	// var commit2 = args.commit2;

	url = global.getDirShortcut(url);
	console.log("getGitDiff.js");

	 var result = {};

	 var script = exec("cd " + path.join(global.httpPath, url), function(error, stdout, stderr){
	 		console.log(error, stdout, stderr); 
			var script = exec("git log --after='" + date + "'", function(error, stdout, stderr){
					console.log(error, stdout, stderr); 
					result.log = stdout;
					callback(result); 
					// var matches = stdout.match(/\(([^\)]*)\)/);
					// result.branch = matches[1];
					// var script = exec('git log --pretty=format:"%h-%ad" -1', function(error, stdout, stderr){
					// 		console.log(error, stdout, stderr); 
					// 		var matches = stdout.match(/^([^\-]*)-([^\-]*)/);
					// 		result.commit = matches[1];
					// 		result.date = matches[2];
					// 		callback(result); 
					// 	});
				});
		});


  	return true;
};
