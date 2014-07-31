requirejs.config({
	baseUrl: '/',
	paths: {
		jquery:          'vendor/jquery/dist/jquery.min',
		angular:         'vendor/angular/angular.min',
		twbootstrap:     'vendor/bootstrap/dist/js/bootstrap.min',
		angularCookies:  'vendor/angular-cookies/angular-cookies.min',
		angularResource: 'vendor/angular-resource/angular-resource.min',
		angularRoute:    'vendor/angular-route/angular-route.min',
	},

	shim: {
		'angular': {
			exports: 'angular'
		},

		'jquery': {
			exports: '$'
		},

		'angularRoute': {
			deps: ['angular']
		},

		'twbootstrap': {
			deps: ['jquery']
		},

		'js/ngapp/services': {
			deps: ['angular']
		},

		'ngeditor': {
			deps: ['angular']
		},

		'js/ngapp/controllers': {
			deps: ['js/ngapp/services']
		},

		'js/ngapp/app': {
			deps: ['js/ngapp/controllers']
		}
	},

	deps: ['js/ngapp/app']
});