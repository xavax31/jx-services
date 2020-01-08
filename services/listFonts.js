/**
 * Not used
 */

exports.async = true;
exports.headersent=true;
exports.run = function (params, callback) {
    var res= params.res;
    
	require('fs').readFile(global.httpPath + global.getDirShortcut("$bobaLastRelease") + '/fonts/fontdb.json', 'utf8', function (err, data) {
    	if (err) throw err; // we'll not consider error handling for now
    	var fonts = JSON.parse(data);
    	
    	for (var i = fonts.length - 1; i >= 0; i--) {
    		//console.log("font ",fonts[i]);

    		
    	};
    	
    	require('fs').readFile(global.httpPath + global.getDirShortcut("$bobaLastRelease") + '/server/node/views/fontcss.ejs', 'utf8', function (err, data) {
    		var ejs = require('ejs');
    		var template = ejs.compile(data);

    		var cssString=template({fonts:fonts, fontPath: global.getDirShortcut("$bobaLastRelease") + "/fonts/"});
    		res.setHeader("Content-Type", "text/css");
    		res.end(cssString);
    	});	
    	//res.render("fontcss", );
	});

}