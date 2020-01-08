/**
 * Used by Editor listProjects
 */

exports.async = true;

var path = require("path");
var fs = require('fs');

/**
* Return an array of projects. Each project data is returned in following format :
* {name, configPath: <path of editor.json>, data: <editor.json content>, projectjx: }
*
* if error occured for a project, data property returns :
* {name: <fileName>, configPath: <path of editor.json>, data: {error: true, mess: "editor.json not exists"} }
*/
exports.run = function (params, callback) {
	var args = params.body ? JSON.parse(params.body.params) : params;

	var refererDir = params.referer.pathDir;
	
	let urls;

	if (typeof args.url == "string") {
		urls = [args.url];
	}
	else { // array
		urls = args.url;
	}

	var filters = args.filters;
	console.log("filters", filters)

	let urlsDone = {};
	let projectsArr = [];

	for (let i = 0; i < urls.length; i++) {
		_listProject(urls[i], filters, refererDir, (projects)=>{
			projectsArr = projectsArr.concat(projects);

			urlsDone[i] = true;

			let finished = true;
			for (let j = 0; j < urls.length; j++) {
				if (!urlsDone[j]) {
					finished = false;
				}
			}
			if (finished) {
				callback({items: projectsArr})
			};
		});
	};
	     
	     
  	return true;
}


function _listProject(url, filters, refererDir, callback) {
		if (url.search(/^\//) != -1) {
			var filePath = path.normalize(global.httpPath + url);
		}else {
			var filePath = path.resolve(refererDir, url)
		}

		fs.readdir(filePath, function(err, items) {
		    //console.log(err);
		    console.log("items", items);

		   	if(!items){
		   		callback([]);
		   		return true;
		   	}

		 	var projectsToTest = [];
		 	var projects = [];

		    for (var i=0; i<items.length; i++) {
		        //console.log(items[i]);

		        //- get info on file/dir
		        var pathItem = path.resolve(filePath, items[i]);
		        var stats = fs.statSync(pathItem);

		        if (stats.isDirectory() && items[i].search(new RegExp(filters, "ig")) != -1) { //- file is directory

		        	//- we get editor.json
		        	var projectjxPath = path.resolve(pathItem, "project.jx");
		        	var editorConfigPath = path.resolve(pathItem, "etc/editor/editor.json");

					projectsToTest.push({
						name: items[i], 
						url: path.resolve(url, items[i]), 
						path: pathItem, 
						configPath: editorConfigPath, 
						projectjxPath: projectjxPath, 
						stats: {
							ctime: stats.ctime,
							mtime: stats.mtime,
							atime: stats.atime
						}
					});

		        };
		    }

		    if (projectsToTest.length == 0) {
		    	callback([]);
		    	return true;
		    };

		    var indexRead = projectsToTest.length;

		    for (var i=0; i<projectsToTest.length; i++) {

		        (function(item){

		        	//- we try to load project.jx
			       	var projectjxFile = fs.readFile(item.projectjxPath, 'utf8', function(err, projectjxData){

	   		       		if (err == null) { 
	   		       			try{
	   							item.projectjxData = JSON.parse(projectjxData);
	   		       			}
	   		       			catch(err){
	   		       				item.projectjxData = {error: true, mess: "JSON malformed", json: projectjxData};
	   		       			}
	   		       			// if exists and valid, we add it

	   		       		}
	   		       		else { // else we return error message
	   		       			console.warn("directory", item.path, " is not an application");
	   		       			item.projectjxData = {error: true, mess: "project.jx not found or can't be loaded"};
	   		       		}


	       		       	var config = fs.readFile(item.configPath, 'utf8', function(err, configData){

	       		       		if (err == null) { 
	       		       			try{
	       							item.configData = JSON.parse(configData);
	       		       			}
	       		       			catch(err){
	       		       				item.configData = {error: true, mess: "JSON malformed", json: configData};
	       		       			}
	       		       			// if exists and valid, we add it

	       		       		}
	       		       		else { // else we return error message
	       		       			console.warn("dir", item.path, " is not an jx application");
	       		       			item.configData = {error: true, mess: "editor.json not found or can't be loaded"};
	       		       		}

	       		       		if (! item.projectjxData.error) {
	       		       			projects.push(item);
	       		       		}

	       			       	indexRead--;

	       			       	if (indexRead == 0) {
	       			       		callback(projects);
	       			       	};
	       		       	});
			       	});
		       }(projectsToTest[i]))
		    }
		    
		});

}
