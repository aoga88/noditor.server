function ProfileController($scope, $timeout, User)
{
	$scope.user = {};
	$scope.editMode = false;
	$scope.sites = [];
	$scope.servers = [];
	$scope.tickets = [];
	$scope.showSuccess = false;
	$scope.showError = false;
	$scope.error = '';

	$scope.$watch('user', function(){
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

	$scope.changePassword = function() {
		if (SHA1($scope.user.currentPassword) !== $scope.user.password) {
			$scope.showError = true;
			$scope.error = "The current password is invalid";
			return false;
		}
		
		$scope.showError = false;

		User.save({_id: $scope.user._id}, {password: SHA1($scope.user.password1)})
		.then(function(data){
			$scope.showSuccess = true;
		});
	}
}