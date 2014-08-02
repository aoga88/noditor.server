function LoginController($scope, $timeout, $location, User)
{
	$scope.showError = false;

	$scope.login = function() {
		var user = $scope.user;
		User.login(user)
		.then(function(data){
			if (typeof data.login !== 'undefined') {
				$scope.showError = true;
				return false;
			}
			window.location.href = '/app';
		});
	}
}