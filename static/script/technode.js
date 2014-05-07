var sApp = angular.module('socketApp',['ngRoute']);

sApp.run(function($window,$rootScope,$http,$location){
	$http({
		url: '/api/validate',
		method: 'GET'
	}).success(function(user){
		console.log(user)
		$rootScope.me = user;
		$location.path('/')
	}).error(function(data){
		console.log('abc')
		$location.path('/login')
	})
	$rootScope.logout = function(){
		$http({
			url: '/api/logout',
			method: 'GET'
		}).success(function(){
			$rootScope.me = null;
			$location.path('/login')
		})
	}
	$rootScope.$on('login',function(evt,me){
		$rootScope.me = me;
	})
})

