'use strict';

/* Controllers */

root.controller('AdminInfosCtrl' ,['$scope','$http','$mediaService', function($scope,$http,$mediaService) {
    
	
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
                           $scope.getUniv(campus.id);
                           $scope.getUniversitySettings();
                           $scope.getUniversityArticles()
                           break;
                       }
                   }
                
           }
       })
   }
   
   $scope.getUniv = function (univId){
       var session = $scope._getSession();
       var data = {command:"getUniversityOverview",userSession:session.session,userId:session.user,univId:univId};
       var promise = $http.post($scope._serverUrl,data);

       promise.success(function(data, status, headers, config) {
           $scope.ready = true;
           if(data.status == "success"){
                   $scope.campus =data.details;
                         
           }
       })
   }
   
   $scope.setField = function(element){

        $scope.campus.thumbnailUrl = element.url
        
    }
   
   $scope.switchMode = function(){
       $scope.editMode = !$scope.editMode
   }
   
   $scope.updateCampus = function(){
       var session = $scope._getSession();
       var data = {command:"setUniversityDetails",userSession:session.session,userId:session.user,university:$scope.campus};
       var promise = $http.post($scope._serverUrl,data);

       promise.success(function(data, status, headers, config) {
           if(data.status == "success"){
                   $scope.getUnivs($scope.campus.id);
				   $scope.switchMode();
                
           }
       })
   }
   
   $scope.browseCampusProfile = function(sections){
	   
	   $mediaService.onReturnMedia($scope,function(media){
			console.log("handler",media);
			if(media && media.element){
			   $scope.setField(media.element);
			}
		   
		});
		if(!sections) sections = [1,1,1];
		$mediaService.requestMedia("images",sections);
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