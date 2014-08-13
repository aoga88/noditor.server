function MonitorController($scope, $timeout, Server, Site, ServerData) {
	$scope.sites   = [];
	$scope.servers = [];
	$scope.server = {
		configuration: {}
	};
	$scope.user = {};
	$scope.serverdata = {};
	$scope.memoryData = {};
	$scope.memoryChart = {};
	$scope.diskPartitions = {};
	$scope.memoryDates = {};
	$scope.cpuChart = {};
	$scope.diskChart = {};
	io = io.connect();
	
	$scope.$watch('user', function(){
		Server.find({user: $scope.user._id})
		.then(function(data){
			$scope.servers = data;
			angular.forEach($scope.servers, function(server, index){
				ServerData.find({server_id: server._id})
				.then(function(data){
					$scope.serverdata[server._id] = data;
					$scope.memoryDates[server._id] = [];
					$scope.memoryData[server._id] = [];
					$scope.cpuChart[server._id] = {
			             options: {
			                 chart: {
			                     type: 'line'
			                 }
			             },
			             series: [],
			             title: {
			                 text: 'CPU'
			             },
			             loading: false,
     		             xAxis: {
			        	    categories: $scope.memoryDates[server._id],
			              title: {text: 'Date'},
			              labels: {
			                    rotation: -90,
			              }
			             },
			             yAxis: {
			                min: 0,
			                max: 100
			            }
			         }

			         $scope.memoryChart[server._id] = {
			             options: {
			                 chart: {
			                     type: 'line'
			                 }
			             },
			             series: [{
			                 data: $scope.memoryData[server._id]
			             }],
			             title: {
			                 text: 'Memory'
			             },
			             loading: false,
			             xAxis: {
			        	  categories: $scope.memoryDates[server._id],
			              title: {text: 'Date'},
			              labels: {
			                    rotation: -90,
			              }
			             },
			             yAxis: {
			                min: 0,
			                max: 100
			            }
			         }

			         $scope.diskPartitions[server._id] = [];
				});

				io.on('updated_' + server._id, function(data){
		      			//console.log(data);

		      			if (typeof $scope.memoryData[server._id] === 'undefined') {
		      				$scope.memoryData[server._id] = [];
		      			}

		      			if (typeof $scope.memoryDates[server._id] === 'undefined') {
		      				$scope.memoryDates[server._id] = [];
		      			}

		      			$scope.memoryData[server._id].push(data.memory.per);
				      	$scope.memoryDates[server._id].push(data.date.substr(11,8));

				      	if (typeof $scope.cpuChart[server._id] === 'undefined') {
				      		$scope.cpuChart[server._id] = {
					             options: {
					                 chart: {
					                     type: 'line'
					                 }
					             },
					             series: [],
					             title: {
					                 text: 'CPU'
					             },
					             loading: false,
		     		             xAxis: {
					        	    categories: $scope.memoryDates[server._id],
					              title: {text: 'Date'},
					              labels: {
					                    rotation: -90,
					              }
					             },
					             yAxis: {
					                min: 0,
					                max: 100
					            }
					         }

				      	}

				      	if ($scope.cpuChart[server._id].series.length === 0) {
				      		for (var i = 0; i < data.cpu.count_logical; i++) {
				      			$scope.cpuChart[server._id].series.push([]);
				      			$scope.cpuChart[server._id].series[i] = {
				      				data: [],
				      				name: 'CPU ' + (i + 1)
				      			};
				      		}
				      	}

				      	for (var i = 0; i < data.cpu.count_logical; i++) {
				      		if ($scope.cpuChart[server._id].series[i].data.length >= 20) {
				      			$scope.cpuChart[server._id].series[i].data.splice(0,1);
				      		}

				  			$scope.cpuChart[server._id].series[i].data.push(data.cpu.per[i]);
				  		}

				  		if ($scope.memoryData[server._id].length >= 20) {
				      		$scope.memoryData[server._id].splice(0,1);
				      		$scope.memoryDates[server._id].splice(0,1);
				      	}

				      	if (typeof $scope.diskPartitions[server._id] === 'undefined') {
				      		$scope.diskPartitions[server._id] = [];
				      		$scope.diskChart[server._id] = {};
				      	}

				      	if ($scope.diskPartitions[server._id].length === 0) {
					      	angular.forEach(data.disk.usage, function(value, key){
					      		$scope.diskPartitions[server._id].push(key);

				  				$scope.diskChart[server._id][key] = {
								    "options": {
								        "chart": {
								            "type": "pie"
								        },
								        "plotOptions": {
								            "series": {
								                "stacking": ""
								            }
								        }
								    },
								    "series": [
								        {
								            "data": [
								                100,
								                0
								            ],
								            "id": "series-0"
								        }
								    ],
								    "title": {
								        "text": "Disk " + key
								    },
								    "tooltip": {
							    	    "pointFormat": key + ': <b>{point.percentage:.1f}%</b>'
							        },
							        plotOptions: {
						                pie: {
						                    allowPointSelect: true,
						                    cursor: 'pointer',
						                    dataLabels: {
						                        enabled: false
						                    },
						                    showInLegend: true
						                }
						            },
								    "loading": false,
								    "size": {}
								}
					      	});
						} else {
							angular.forEach(data.disk.usage, function(value, key){
				  				value.free = (((value.free / 1024) / 1024) / 1024);
				  				value.used = (((value.used / 1024) / 1024) / 1024);
				  				$scope.diskChart[server._id][key].series[0].data = [['Free', value.free], ['Used', value.used]];
				  				console.log($scope.diskChart[server._id][key]);
				  			});	
						}

						

				      	$scope.$apply();
		      		});
			})
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