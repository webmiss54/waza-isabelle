'use strict';

/* Controllers */

root.controller('AdminCommunicationCtrl' ,['$scope','$http', function($scope,$http) {
        
        
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
                           $scope.getUniversitySettings();
                           $scope.getUniversityArticles()
                           break;
                       }
                   }
                
           }
       })
   }
   
    $scope.getUniversitySettings = function (){
       var session = $scope._getSession();
       var data = {command:"getUniversitySettings",userSession:session.session,userId:session.user,univId:$scope.campus.id};
       var promise = $http.post($scope._serverUrl,data);

       promise.success(function(data, status, headers, config) {
           $scope.ready = true;
           if(data.status == "success"){
                $scope.campus.settings ={}
                for(var element in data.details){
                    
                    $scope.campus.settings[element] = data.details[element]?true:false;
                }
           }
       })
   }
   
   $scope.getUniversityArticles = function (){
       var session = $scope._getSession();
       var data = {command:"getUniversityArticles",userSession:session.session,userId:session.user,univId:$scope.campus.id,searchInput:$scope.searchInput};
       var promise = $http.post($scope._serverUrl,data);

       promise.success(function(data, status, headers, config) {
           $scope.ready = true;
           if(data.status == "success"){
                   $scope.campus.articles =data.details
           }
       })
   }
   
    $scope.setUniversitySettings = function(){
       var session = $scope._getSession();
       var data = {command:"setUniversitySettings",userSession:session.session,userId:session.user,univ:{id:$scope.campus.id,settings:$scope.campus.settings}};
       var promise = $http.post($scope._serverUrl,data);

       promise.success(function(data, status, headers, config) {
           $scope.ready = true;
           if(data.status == "success"){
                   $scope.getUniversitySettings($scope.campus.id);
           }
       })
    }
    
    $scope.switchUniversityArticle = function(article){
       var session = $scope._getSession();
       var data = {command:"switchUniversityArticle",userSession:session.session,userId:session.user,universityId:$scope.campus.id,articleId:article.id,value:!article.active};
       var promise = $http.post($scope._serverUrl,data);

       promise.success(function(data, status, headers, config) {
           $scope.ready = true;
           if(data.status == "success"){
                   article.active = !article.active;
           }
       })
    }
    
    $scope.init = function(){
        $scope.getUnivs();
    }
    
   $scope.init();
        
}]);