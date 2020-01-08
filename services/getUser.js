/**
 * Use by Editor _getUser
 * @type {Boolean}
 */

exports.async = true;

exports.run = function (params, callback) {
	var args = params.body ? JSON.parse(params.body.params) : params;

	var user = {};
	// carefull: global.user represents the last user's request
	for (var prop in global.user){
		if(prop != "password"){
			user[prop] = global.user[prop];
		}
	}
	//console.log("getUser", user);
	user.xxx = process.env.USER + "/" + process.env.USERDOMAIN + '/' + process.env.USERNAME;
	callback(user);
};
