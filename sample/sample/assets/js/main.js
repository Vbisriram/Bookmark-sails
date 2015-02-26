(function() {

	var myapp = angular.module('myApp', [

		//Application dependencies

		//Common Modules

		//Bower Depenencies

	]);



	myapp.controller('catCtrl', ['$scope', '$http',
		function($scope, $http) {
			$scope.msg = 'dinesh';
			// $scope.CurrentCategory = null;
			//Populating Categories

			$scope.cats = [];
			$http.get('http://localhost:1337/category')
				.success(function(data) {
					$scope.cats = data;
				})
				.error(function(data, status, headers, config) {});
			$scope.setCurrentCategory = function(a) {
				$scope.CurrentCategory = a;
			}
			$scope.bkmrks = [];
			$http.get('http://localhost:1337/bookmark')
				.success(function(data) {
					$scope.bkmrks = data;
					console.log(data);

				})
				.error(function(data, status, headers, config) {});
			$scope.setCurrentCategory = function(a) {
				$scope.CurrentCategory = a;
				console.log($scope);
				//$scope.$apply();
			}
			console.log($scope.CurrentCategory);
		}
	]);



})();
