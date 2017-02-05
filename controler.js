var myApp = angular.module('myApp',[]);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http){
	console.log("Hello from controller!");
	$scope = $scope;
	$http.get("/list").then(function(response){
		console.log("GOT Data requested");
		$scope.list = response;
	});
	
}]);