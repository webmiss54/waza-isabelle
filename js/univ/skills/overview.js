'use strict';

/* Controllers */

root.controller('AdminUnivSkillsOverview' ,['$scope','$http','$routeParams', function($scope,$http,$routeParams) {
  
    $scope.init = function(){   
        
        var session = $scope._getSession();
        var data = {command:"getUniversitySkillsOverview",userSession:session.session,userId:session.user,universityId:$scope.campus.id};
        var promise = $http.post($scope._serverUrl,data);
        promise.success(function(data, status, headers, config) {
            if(data.status == "success"){
                $scope.campus.nbSyllabusSkills = data.details.nbSyllabusSkills;
                $scope.campus.nbUsersWithSkills = data.details.nbUsersWithSkills;
                $scope.campus.nbSyllabusKeywords = data.details.nbSyllabusKeywords;
                $scope.campus.nbMatches = data.details.nbMatches;
                $scope.campus.nbUsers = data.details.nbUsers;
            }
            else{
            }
        })
    
    }
    
    $scope.init();
           
}])