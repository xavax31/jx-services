/**
 * Not used for test only
 */

exports.async = true;

exports.run = function (params={}, callback=(result)=>{}) {
	var args = params.body ? JSON.parse(params.body.params) : params;
	console.log("test params", args)
	callback({fromTEST: "ok"});
};
