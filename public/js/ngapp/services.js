requirejs([
	'angular',
	'js/ngapp/services/user',
], function(angular){
	angular.module('appServices', [])
		.factory('User', ["$http", "$q", User])
	;
});