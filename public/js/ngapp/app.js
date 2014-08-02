requirejs.config({
	shim: {
		'js/ngapp/controllers': {
			deps: ['js/ngapp/services']
		},

		'js/ngapp/services': {
			deps: ['js/sha1']
		}
	},

	deps: ['js/ngapp/services', 'js/ngapp/controllers']
});

define([
	'jquery',
	'twbootstrap',
	'angular',
	'angularRoute',
	'js/sha1',
	'js/ngapp/services',
	'js/ngapp/controllers'
], function($, bt, angular){

	var app = null;

	angular.element(document).ready(function() {

		angular.module('app', ['appServices'])
			.config(function($interpolateProvider){
		        $interpolateProvider.startSymbol('[[').endSymbol(']]');
		    });

		angular.bootstrap(document, ['app']);
	})
});