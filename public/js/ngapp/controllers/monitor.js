function MonitorController($scope, $timeout, Server, Site) {
	$scope.sites   = [];
	$scope.servers = [];
	$scope.server = {
		configuration: {}
	};
	$scope.user = {};
	
	$scope.$watch('user', function(){
		Server.find({user: $scope.user._id})
		.then(function(data){
			$scope.servers = data;
			$scope.$emit('serverLoaded');
		});
	});

	/*Site.find({})
	.then(function(data){
		$scope.sites = data;
	});*/

	$scope.oSystems = [
		{'label': 'Linux', 'value': 'linux'},
		{'label': 'Windows', 'value': 'win'},
		{'label': 'BSD', 'value': 'bsd'}
	];

	$scope.distros = {
		'linux': [
			'Ubuntu',
			'Debian',
			'Fedora',
			'CentOS',
			'SUSE Linux'
		],
		'win': [
			'Server 2012',
			'Server 2008',
			'Server 2003',
			'Server 2000'
		],
		'bsd': [
			'Net BSD',
			'Free BSD'
		]
	};

	$scope.toggleConfiguration = function(variable) {
		if (typeof $scope.server.configuration[variable] === 'undefined') {
			$scope.server.configuration[variable] = true;
			return false;
		}

		if ($scope.server.configuration[variable] === true) {
			$scope.server.configuration[variable] = false;
		} else {
			$scope.server.configuration[variable] = true;
		}
	}

	$scope.saveServer = function() {
		$scope.server.user = $scope.user._id;
		Server.insert($scope.server)
		.then(function(data){
			window.location.href = '/app/monitor/server/' + data._id;
		});
	}

	$scope.validateNew = function(maxServers) {
		$scope.$on('serverLoaded', function(){
			if ($scope.servers.length >= maxServers) {
				window.location.href = '/app/monitor/server';
			}
		})
	}
}