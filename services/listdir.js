/**
 * Not used
 */

exports.async = true;

exports.run = function (params, callback) {
	var args = params.body;
	var refererDir = params.referer.pathDir;

	var path = require("path");
	var fs = require('fs');
	var url = args.url;

	if (url.search(/^\//) != -1) {
		var filePath = path.normalize(global.httpPath + url);
	}else{
		var filePath = path.resolve(refererDir, url)
	}

	fs.readdir(filePath, function(err, items) {
	    //console.log(err);
	    //console.log(items);
	 	var projectsToTest = [];
	 	var projects = [];

	    for (var i=0; i<items.length; i++) {
	        //console.log(items[i]);
	        var pathItem = path.resolve(filePath, items[i]);
	        var stats = fs.statSync(pathItem);
	        if (stats.isDirectory()) {
	        	//console.log("dir: ", pathItem);
	        	var editorConfigPath = path.resolve(pathItem, "etc/editor/editor.json");
	        	//console.log("editorConfigPath: ", editorConfigPath);
				projectsToTest.push({name: items[i], path: pathItem, configPath: editorConfigPath});
	        };
	    }

	    var indexRead=projectsToTest.length
	    for (var i=0; i<projectsToTest.length; i++) {
	        //console.log(projectsToTest[i]);
	        (function(item){
		       	var config = fs.readFile(item.configPath, 'utf8', function(err, data){
		       		//console.log("ERR",err);
		       		//console.log("projectsToTest", projectsToTest);
		       		if (err == null) {
		       			//console.log("SUCCESS", item.configPath , " is an application", data);
		       			try{
							item.data = JSON.parse(data);
		       			}
		       			catch(err){
		       				item.data = {error: true, mess: "JSON malformed", json: data};
		       			}
		       			
		       			projects.push(item)
		       			//console.log("projects", projects)

		       		}
		       		else{
		       			console.warn("dir", item.configPath, " is not an application");
		       			item.data = {error: true, mess: "editor.json not exists"};
		       			projects.push(item)
		       		}
			       	indexRead--;
			       	//console.log("indexRead", indexRead)
			       	if (indexRead == 0) {
			       		//console.log("Finish", callback);
			       		callback({items: projects });
			       	};
		       	});
	       }(projectsToTest[i]))
	    }
	    
	});
	     
  	return true;
};
