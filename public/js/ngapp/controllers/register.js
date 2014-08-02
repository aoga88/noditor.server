function RegisterController($scope, $timeout, User)
{
	$scope.disableButtons = false;

	$scope.register = function() {
		$scope.disableButtons = true;
		User.find({_id: $scope.user._id})
		.then(function(data){
			console.log(data);
		});
	}	
}