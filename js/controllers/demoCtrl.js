wazaApp.controller('demoCtrl', ['$scope', function($scope) {
	$scope.text = "ceci est un texte";

	$scope.students = [
	{"firstname" : "Marc", "lastname":"Manning"},
	{"firstname" : "Paul", "lastname":"aguilar"},
	{"firstname" : "Isabelle", "lastname":"estrada"},
	{"firstname" : "Amelie", "lastname":"roy"}
	];
}]);