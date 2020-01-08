/**
 * Used by Editor saveText, saveJSON, Used by DbManager saveText, saveJSON
 */
exports.async = true;


exports.run = function (params, callback) {
	var args = params.body ? JSON.parse(params.body.params) : params;
	// console.log(args);
	var refererDir = params.referer ? params.referer.pathDir : null;

	var path = require("path");
	var fs = require('fs');
	var url = args.url;
	var text = args.text;
	var filePath = null;
	if (url.search(/^\//) != -1) {
		filePath = path.normalize(global.httpPath + url);
	}else{
		if( refererDir != null) {
			filePath = path.resolve(refererDir, url)
		}
	}
	
	//console.log("writefile " + filePath + " \nWITH TEXT : \n" + text)
	
	if (filePath != null) {
		fs.writeFile(filePath, text, function (err) {
			if (err) throw err;
			// console.log('file saved');
			if (callback) callback({success: true});
		});
	}
	else {
		console.error("Can resolve URL " + url + " to correct filePath\n File NOT SAVED");
		callback({success: false, mess: "Can resolve URL " + url + " to correct filePath\n File NOT SAVED"});
	}
    
  	return true;
};
