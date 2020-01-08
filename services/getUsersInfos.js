/**
 * Use by Editor getUsersInfos
 * @type {Array}
 */

exports.async = true;

exports.run = function (params, callback) {
	var args = params.body ? JSON.parse(params.body.params) : params;

	// // determine actif user
	// var user = {};
	// // carefull: global.user represents the last user's request
	// for (var prop in global.user){
	// 	if(prop != "password"){
	// 		user[prop] = global.user[prop];
	// 	}
	// }

	let userInfos = global.config.usersList.filter(user=>{
		return user.name == global.user.name;
	})[0];

	callback({usersList: global.config.usersList, current: userInfos});
};
