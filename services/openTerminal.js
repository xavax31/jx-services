
/**
 * Open terminal on url.
 * Used by Editor openTerminal
 */

exports.async = true;

var fs = require('fs');
var path = require("path");
var open = require('open');

exports.run = function (params, callback) {
	var args = params.body ? JSON.parse(params.body.params) : params;

	console.log("openTerminal", args);
	var filePath = path.join(global.httpPath, args.url);

	if (fs.existsSync(filePath)) {
		var exec = require('child_process').exec;
		var command = "osascript -e 'tell application \"Terminal\" to do script \"cd " + filePath + "\"' -e 'tell application \"Terminal\" to activate window 1'"; 
		var script = exec(command, function(error, stdout, stderr){
			console.log(error, stdout, stderr); 
			callback({success:true, error:error, stdout: stdout, stderr:stderr}); 
		});

		// open(path.join(global.httpPath, args.url));
		// callback({success:true});
	}
	else{
		callback({success:false});
	}

	return true;
}