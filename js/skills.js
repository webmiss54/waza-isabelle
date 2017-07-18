'use strict';

/* Controllers */

root.controller('AdminSkillsCtrl' ,['$scope','$http','$routeParams', function($scope,$http,$routeParams) {
        
    
    
    $scope.refreshRoute = function(){
        if(!$scope.currentScreen) $scope.currentScreen = $routeParams.currentScreen;
        if(!$scope.currentScreen) $scope.currentScreen = "overview";
    }
    $scope.getUnivs = function(){
       var session = $scope._getSession();
       var data = {command:"getUniversitiesByUser",userSession:session.session,userId:session.user};
       var promise = $http.post($scope._serverUrl,data);

        promise.success(function(data, status, headers, config) {
           $scope.ready = true;
           if(data.status == "success"){
                   $scope.campuses =data.details;
                   for(var index in data.details){
                       var campus = data.details[index]
                       if(campus.status=="1"){
                           $scope.campus = {"id":campus.id,name:campus.name,ownerId:campus.ownerId};
                           $scope.refreshRoute();
                           break;
                       }
                   }
                
           }
       })
    }
    $scope.getUnivs();
    
}])