var root = angular.module('wazaApp', ['ngRoute']);

root.config(['$routeProvider', function($routeProvider){
	$routeProvider
	.when('/users',{
        templateUrl : 'partials/users.html',
        controller: 'AdminUsersCtrl'
    })
	.otherwise({
	redirectTo : '/'
});
}]);