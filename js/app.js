var wazaApp = angular.module('wazaApp', ['ngRoute']);

wazaApp.config(['$routeProvider', function($routeProvider){
	$routeProvider.
	.when('/users',{
        templateUrl : 'partials/users.html',
        controller: 'AdminUsersCtrl'
    })
	.otherwise({
	redirectTo : '/'
});
}]);