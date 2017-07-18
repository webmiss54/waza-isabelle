'use strict';

/* Controllers */

root.controller('AdminUnivSkillsMatches' ,['$scope','$http','$routeParams', function($scope,$http,$routeParams) {
  
    $scope.init = function(){   
        
        var session = $scope._getSession();
        var data = {command:"getUniversityUserMatches",userSession:session.session,userId:session.user,universityId:$scope.campus.id};
        var promise = $http.post($scope._serverUrl,data);
        promise.success(function(data, status, headers, config) {
            if(data.status == "success"){
                $scope.matches = data.details
            }
            else{
            }
        })
    
    }
    
    $scope.init();
           
}])