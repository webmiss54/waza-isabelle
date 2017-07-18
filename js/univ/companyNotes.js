'use strict';

/* Controllers */

root.controller('AdminCompaniesNotesCtrl' ,['$scope','$http','$routeParams', function($scope,$http,$routeParams) {
        
    $scope.newNote = {};
	
	$scope.init = function(){
        $http.post($scope._serverUrl,{command:"getUniversityEntrepriseNotes",userSession:$scope._getSession().session,userId:$scope._getSession().user,entrepriseId:$scope.entrepriseId,universityId:$scope.campus.id}).success(function(data, status, headers, config) {
            if(data.status == "success"){
                $scope.notes = {elements:data.details};
            }
            else{

            }
        });
    
	}
	
	$scope.addNote = function(note){
        $http.post($scope._serverUrl,{command:"addUniversityEntrepriseNote",userSession:$scope._getSession().session,userId:$scope._getSession().user,entrepriseId:$scope.entrepriseId,universityId:$scope.campus.id,note:note}).success(function(data, status, headers, config) {
            if(data.status == "success"){
                $scope.init();
            }
            else{

            }
        });
    
	}
	
	
        
	$scope.init();
}]);