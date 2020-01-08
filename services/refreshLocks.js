/**
 * Used by Editor refreshLocks
 * @type {Boolean}
 */
exports.async = true;

exports.run = function (params, callback) {
	var args = params.body ? JSON.parse(params.body.params) : params;

	var path = require("path");
	var fs = require('fs-extra');

	var lock = args.lock == undefined ? null : args.lock; // action: null=none, true=lock, false=unlock
	var url = args.url;
	var user = args.user;

	var lockDir = path.resolve(global.httpPath, "_temp/locks");
	fs.mkdirsSync(lockDir);

	// get locks list
	var list = fs.readdirSync(lockDir).filter(function(file) {
	  return file;
	});

	var lockResult = {toDelete:[], result: "free"};
	var listLength  = list.length;
	var result;
	var date = new Date().getTime();
	var urlCoded = url.replace(/^\//, "").replace(/\/$/, "").replace(/\//g, "_");
	//console.log(list)

	for (var i = 0; i < listLength; i++) {
		var matches = list[i].match(/^(.*)_([^_]*)_([0-9]*)\.lock$/);
		//console.log(matches)
		if (matches) {
			result = { url: matches[1], username: matches[2], timestamp: matches[3]};
			//console.log("TEST", (date - result.timestamp > 60000), (result.url == urlCoded && result.username == user.name))

			if (result.url == urlCoded && result.username == user.name) {
				// update file
				lockResult.result = "lockedByThisUser";
				lockResult.toDelete.push(list[i]);
			}
			else if (date - result.timestamp > 60000) {
				//delete file
				lockResult.toDelete.push(list[i]);
			}
			else if (result.url == urlCoded && result.username != user.name) {
				lockResult.result = "locked";
				lockResult.user = {name: result.username};
			}

		}

	}
	

	var removeOlds = function(array) {
		for (var i = 0; i < array.length; i++) {
			fs.unlink( path.resolve(lockDir, array[i]), evt=>{} );
		};
	}

	// case Success, project is free or use by this user

	if (lockResult.result == "lockedByThisUser") {
		if (lock === null) { // juste return info
				var filePath = path.resolve(lockDir, url.replace(/^\//, "").replace(/\/$/, "").replace(/\//g, "_") + "_" + user.name + "_" + date + ".lock");
				fs.writeFile(filePath, "", function (err) {
			        if (err) throw err;
			        removeOlds(lockResult.toDelete);
			        callback({result: "free"});
			    });
		}
		else if (lock == true) { // lock project
			var filePath = path.resolve(lockDir, url.replace(/^\//, "").replace(/\/$/, "").replace(/\//g, "_") + "_" + user.name + "_" + date + ".lock");
			fs.writeFile(filePath, "", function (err) {
		        if (err) throw err;
		        removeOlds(lockResult.toDelete);
		        callback({result: "success"});
		    });
		}
		else if (lock == false) { // unlock project
			removeOlds(lockResult.toDelete);
			callback({result: "success"});
		}
	}
	else if (lockResult.result == "free") {
		if (lock === null) { // juste return info
			removeOlds(lockResult.toDelete);
			callback({result: "free"});
		}
		else if (lock == true) { // lock project
			var filePath = path.resolve(lockDir, url.replace(/^\//, "").replace(/\/$/, "").replace(/\//g, "_") + "_" + user.name + "_" + date + ".lock");
			fs.writeFile(filePath, "", function (err) {
		        if (err) throw err;
		        removeOlds(lockResult.toDelete);
		        callback({result: "success"});
		    });
		}
		else if (lock == false) { // unlock project
			removeOlds(lockResult.toDelete);
			callback({result: "success"});
		}
	}
	else {
	    removeOlds(lockResult.toDelete);
		delete lockResult.toDelete;

		if (lock === null) { // juste return info
			callback(lockResult);
		}
		else if (lock == true) { // lock project
			callback(lockResult);		
		}
		else if (lock == false) { // unlock project
			callback(lockResult);
		}
	}

  	return true;
};
