var path = require('path');

var execFromExpress = (req, res)=>{
	//console.log("jx-services", req, res);

	var refererDir = req.params[ 0 ];
	var action = req.params[ 1 ];
	var args = {
	    referer: {
	        url: req.headers.referer,
	        pathDir: path.normalize( global.httpPath + refererDir )
	    },
	    query: req.query,
	    body: req.body,
	    req :req,
	    res :res,
	};

	var service = require( './services/' + action + '.js' );
	
	if (service.async !== true) {
	    var result = service.run( args );
	    if (service.headersent!==true) {
	        res.send( {
	            data: result
	        });
	    }
	} else {
	    var result = service.run( args, function(result){
	        if (service.headersent!==true) {
	            res.send( result );
	        }    
	    });
	}
}
//test6
module.exports = {
	execFromExpress: execFromExpress,
	test: require("./services/test").run,
	cloneDir: require("./services/cloneDir").run,
	createDir: require("./services/createDir").run,
	deleteDir: require("./services/deleteDir").run,
	deleteFile: require("./services/deleteFile").run,
	writeFile: require("./services/writefile").run,
	zip: require("./services/zip").run,
	unzip: require("./services/unzip").run,
	execBash: require("./services/execBash").run,
	filesExist: require("./services/filesExist").run,
	getUser: require("./services/getUser").run,
	listProjects: require("./services/listProjects").run,
	listVersions: require("./services/listversions").run,
	gitInitWithBitBucketLink: require("./services/gitInitWithBitBucketLink").run,
	updateInternJX: require("./services/updateInternJX").run,
	getCurrentCommit: require("./services/getCurrentCommit").run,
	extraAction1: require("./services/extraAction1").run
}
