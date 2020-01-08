/**
 * Used by Editor.js cloneRepository
 */

 exports.async = true;

var sys = require('sys')
var exec = require('child_process').exec;

exports.run = function (params, callback) {
	var args = params.body ? JSON.parse(params.body.params) : params;

	var path = args.path;
	if (path == undefined) {
		callback({success:true })
		return false;
	}

	var bobaPath = global.httpPath 
	var pathoption = " -p "+ bobaPath + "/" + path;	
	
	var commit = args.commit;
	var giturl = " -u "+args.url;
	var branch = args.branch;
	
	var tagoption = (args.tag!=undefined) ? " -t tags/" + args.tag:""

	var branchoption = (branch!=undefined) ? " -b " + branch : "";
	var commitoption = (commit!=undefined) ? " -c " + commit:"";

	var command = "../../scripts/clonerepository.sh " + branchoption + commitoption + pathoption + giturl + tagoption;
	console.log("gitcommand",command);
	exec(command, puts);

	callback({success:true })
	return true;
}

function puts(error, stdout, stderr) {
	sys.puts(stdout, error, stderr);
}