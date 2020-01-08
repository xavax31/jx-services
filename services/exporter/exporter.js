var fs = require('fs-extra');
var path = require("path");
var Cloner = require("../copy-folder");
var exporters = {
	WebTest : require("./export_type/WebTest"),
	Aquafadas : require("./export_type/Aquafadas"),
	Mix : require("./export_type/Mix"),
	Full : require("./export_type/Full"),
	Web : require("./export_type/Web")
}


function publish(params) {	console.log("expublish", params)

	exporters[params.type].publish(params);

};


module.exports.publish = publish;


