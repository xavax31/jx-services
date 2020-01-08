/**
 * Used by Editor.js execBash, execBash2
 */

exports.async = true;

exports.run = function (params, callback) {
	var args = params.body ? JSON.parse(params.body.params) : params;

	console.log("Exec Bash")
	var path = require("path");
	var fs = require('fs');

	var rootDir = args.rootDir;
	var commandline = args.commandline;
	var scriptName = args.scriptName;
	var output = args.output || "current";
	
	console.log("commandline", commandline);
	console.log("output", output);

	var exec = require('child_process').exec;
	const { spawn } = require('child_process');
	var command;

	var sysShortcuts = {
		"$sshConnect": "ssh-add ~/.ssh/id_rsa_ba"
	}

	if (sysShortcuts[commandline]) {
		commandline = sysShortcuts[commandline];
		if (output == "new") { // launch in new terminal
			var scriptsPath = path.join(global.httpPath, global.config.dirShortcuts["bobaLastRelease"], "scripts");
			command = "osascript -e 'tell application \"Terminal\" to do script \"" + commandline + "\"' -e 'tell application \"Terminal\" to activate'"; 
		}
		else { // launch in current node terminal
			command = commandline; 
		}
	}
	else if (rootDir && commandline) {
		// if (rootDir == "//") { // removed, may be not secure, use sysShortcuts rather
		// 	if (output == "new") { // launch in new terminal
		// 		var scriptsPath = path.join(global.httpPath, global.config.dirShortcuts["bobaLastRelease"], "scripts");
		// 		command = "osascript -e 'tell application \"Terminal\" to do script \"" + commandline + "\"' -e 'tell application \"Terminal\" to activate'"; 
		// 	}
		// 	else { // launch in current node terminal
		// 		command = commandline; 
		// 	}
		// }

		rootDir = path.join(global.httpPath, rootDir);

		if (output == "new") { // launch in new terminal
			var scriptsPath = path.join(global.httpPath, global.config.dirShortcuts["bobaLastRelease"], "scripts");
			command = "osascript -e 'tell application \"Terminal\" to do script \"cd " + rootDir + "; ./" + commandline + "\"' -e 'tell application \"Terminal\" to activate'"; 
		}
		else { // launch in current node terminal
			command = "cd " + rootDir + ";" + commandline; 
		}
				
	}
	else if (commandline) {
		if (output == "new") { // launch in new terminal
			var scriptsPath = path.join(global.httpPath, global.config.dirShortcuts["bobaLastRelease"], "scripts");
			command = "osascript -e 'tell application \"Terminal\" to do script \"cd " + scriptsPath + "; ./" + commandline + "\"' -e 'tell application \"Terminal\" to activate'"; 
		}
		else { // launch in current node terminal
			command = "../../scripts/"+commandline; 
		}
	}
	else{
		if (output == "new") { // launch in new terminal
			var scriptsPath = path.join(global.httpPath, global.config.dirShortcuts["bobaLastRelease"], "scripts");
			command = "osascript -e 'tell application \"Terminal\" to do script \"cd "+scriptsPath+"; ./"+scriptName+".sh\"' -e 'tell application \"Terminal\" to activate'"; 
		}
		else { // launch in current node terminal
			command = "../../scripts/"+scriptName+".sh"; 
		}
		
	}
	console.log("command", command)
	var script = exec(command, function(error, stdout, stderr){
		console.log(error, stdout, stderr); 
		callback({error:error, stdout: stdout, stderr:stderr}); 
	});

	// const child = spawn(command);

	// child.stdout.on('data', (data) => {
	// 	console.log(`child stdout:\n${data}`);
	//   });

	//   child.on('exit', function (code, signal) {
	// 	console.log('child process exited with ' + `code ${code} and signal ${signal}`);
	// 	callback(); 
	//   });
};
