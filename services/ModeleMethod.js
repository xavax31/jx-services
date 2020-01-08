/**
 * Model not used
 */

exports.async = true; // if async function and need callback

exports.run = function (params, callback) {
	var args = params.body ? JSON.parse(params.body.params) : params;

	callback({success:false}); // if async

	return true;
}