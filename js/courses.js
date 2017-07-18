'use strict';

/* Controllers */

root.controller('AdminCoursesCtrl' ,['$scope','$http', function($scope,$http) {
        
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
                           $scope.campus = {"id":campus.id,"settings":{},"articles":{},name:campus.name};
                           break;
                       }
                   }
                
           }
       })
   }    
        
    $scope.init = function(){
        $scope.getUnivs();
    }
    
   $scope.init();
        
}]);