/**
 * Not used
  */
exports.run = function (params) {
	var args = params.body;

	console.log("run upload", args)
	var path = require("path");
	var fs = require('fs');
	var file = "data:image/png;base64," + args.file;
	console.log("file", file);
	// if (params.url.search(/^\//) != -1) {
	 	var filePath = path.normalize(global.httpPath + "/yo.png");
	// }else{
	// 	var filePath = path.resolve(params._reqData.referer.pathDir, params.url)
	// }
	
	// console.log("writefile " + filePath + " \nWITH TEXT : \n" + params.text)
	 fs.writeFile(filePath, file, function (err) {
        if (err) throw err;
        //console.log('file saved');
    });
  return true;
};
