function ProfileController($scope, $timeout, User)
{
	$scope.user = {};
	$scope.editMode = false;
	$scope.sites = [];
	$scope.servers = [];
	$scope.tickets = [];

	$scope.$watch('user', function(){
		delete $scope.user.password;
		delete $scope.user.plan;
		delete $scope.user.created;
		delete $scope.user.active;
		delete $scope.user.deleted;
	});

	$scope.save = function() {
		User.save({_id: $scope.user._id}, $scope.user)
		.then(function(data){
			window.location.href = '/app/profile';
		});
	}
}