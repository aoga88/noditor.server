function ServerController($scope, $timeout, Server, ServerData)
{
	$scope.server = {};
	$scope.serverdata = [];
	$scope.memoryData = [];
	$scope.memoryDates = [];
	$scope.diskPartitions = [];
	$scope.diskChart = {};
  io = io.connect()

	$scope.loadServer = function() {
		Server.find({_id: $scope.server._id})
		.then(function(data){
			
		});

		ServerData.find({server_id: $scope.server._id})
		.then(function(data){
			$scope.serverdata = data;
		});	
	}

	$scope.memoryChart = {
             //Main highcharts options.
             options: {
                 chart: {
                     type: 'line'
                 }
             },
             //Series object - a list of series using normal highcharts series options.
             series: [{
                 data: $scope.memoryData
             }],
             //Title configuration
             title: {
                 text: 'Memory'
             },
             //Boolean to control showng loading status on chart
             loading: false,
             //Configuration for the xAxis. Currently only one x axis can be dynamically controlled.
             //properties currentMin and currentMax provied 2-way binding to the chart's maximimum and minimum
             xAxis: {
        	  categories: $scope.memoryDates,
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

    $scope.cpuChart = {
             //Main highcharts options.
             options: {
                 chart: {
                     type: 'line'
                 }
             },
             //Series object - a list of series using normal highcharts series options.
             series: [],
             //Title configuration
             title: {
                 text: 'CPU'
             },
             //Boolean to control showng loading status on chart
             loading: false,
             //Configuration for the xAxis. Currently only one x axis can be dynamically controlled.
             //properties currentMin and currentMax provied 2-way binding to the chart's maximimum and minimum
             xAxis: {
        	    categories: $scope.memoryDates,
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
	
    io.on('updated_' + server_id, function(data){
      	if ($scope.diskPartitions.length === 0) {
      		angular.forEach(data.disk.usage, function(value, key){
  				$scope.diskPartitions.push(key);

  				$scope.diskChart[key] = {
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

  			angular.forEach(data.disk.usage, function(value, key){
  				value.free = (((value.free / 1024) / 1024) / 1024);
  				value.used = (((value.used / 1024) / 1024) / 1024);
  				$scope.diskChart[key].series[0].data = [['Free', value.free], ['Used', value.used]];
  			});
      	}

      	$scope.memoryData.push(data.memory.per);
      	$scope.memoryDates.push(data.date.substr(11,8));

      	if ($scope.cpuChart.series.length === 0) {
      		for (var i = 0; i < data.cpu.count_logical; i++) {
      			$scope.cpuChart.series.push([]);
      			$scope.cpuChart.series[i] = {
      				data: [],
      				name: 'CPU ' + (i + 1)
      			};
      		}
      	}

      	for (var i = 0; i < data.cpu.count_logical; i++) {
      		if ($scope.cpuChart.series[i].data.length >= 20) {
      			$scope.cpuChart.series[i].data.splice(0,1);
      		}

  			$scope.cpuChart.series[i].data.push(data.cpu.per[i]);
  		}

  		if ($scope.memoryData.length >= 20) {
      		$scope.memoryData.splice(0,1);
      		$scope.memoryDates.splice(0,1);
      	}

  		angular.forEach(data.disk.usage, function(value, key){
  			value.free = (((value.free / 1024) / 1024) / 1024);
  			value.used = (((value.used / 1024) / 1024) / 1024);
			$scope.diskChart[key].series[0].data = [['Free', value.free], ['Used', value.used]];
		});

        $scope.$apply();
    });

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
}