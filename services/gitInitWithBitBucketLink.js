/**
 * Used by Editor gitInitWithBitBucketLink
 */

exports.async = true;

let path = require("path");
let fs = require('fs-extra');
let exec = require('child_process').exec;

exports.run = function (params, callback) {
	let args = params.body ? JSON.parse(params.body.params) : params;
	
	let url = args.url;
	console.log("url", url)

	let result = {};
	let commandline = "cd " + path.join(global.httpPath, url);

	exec(commandline, function(error, stdout, stderr){
		console.log(error, stdout, stderr);
		exec(commandline + "&& git init && git add * && git commit -m 'base'", function(error, stdout, stderr){
			console.log(error, stdout, stderr);
			result.log = stdout;
			callback(result); 
		})
	})

  	return true;
};
