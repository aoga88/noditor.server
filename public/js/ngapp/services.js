requirejs([
	'angular',
	'js/ngapp/services/user',
	'js/ngapp/services/server',
	'js/ngapp/services/serverdata',
	'js/ngapp/services/site',
], function(angular){
	angular.module('appServices', [])
		.factory('User', ["$http", "$q", User])
		.factory('Server', ["$http", "$q", Server])
		.factory('ServerData', ["$http", "$q", ServerData])
		.factory('Site', ["$http", "$q", Site])
	;
});