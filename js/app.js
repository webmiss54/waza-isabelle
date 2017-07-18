var wazaApp = angular.module('wazaApp', ['ngRoute']);

wazaApp.config(['$routeProvider', function($routeProvider){
	$routeProvider.
	when('/',{
		templateUrl : 'views/demo.html',
	})
	.otherwise
	redirecTo : '/'
});
}]);