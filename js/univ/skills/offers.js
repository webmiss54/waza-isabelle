'use strict';

/* Controllers */

root.controller('AdminUnivSkillsOffers' ,['$scope','$http','$routeParams', function($scope,$http,$routeParams) {
  
  
    $scope.buildCloudWord = function(){
        var words = Object.keys($scope.skills).map(function(element){
            return  {text: element, weight: Math.min(200,10*$scope.skills[element])}
        })

        $('#keywords').jQCloud(words);
        
    }
    $scope.initSkills = function(){
        var session = $scope._getSession();
        var data = {command:"getOffersAllKeywords",userSession:session.session,userId:session.user};
        var promise = $http.post($scope._serverUrl,data);
        promise.success(function(data, status, headers, config) {
            if(data.status == "success"){
                $scope.skills = data.details;
                $scope.buildCloudWord();
            }
            else{
            }
        })
    }
    
    $scope.initSkills();
}]);