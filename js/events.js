'use strict';

/* Controllers */

root.controller('AdminEventsCtrl' ,['$scope','$http','$routeParams', function($scope,$http,$routeParams) {
    
	$scope.followedEvents = [];
	$scope.upcomingEvents = [];
	$scope.historyEvents = [];
	$scope.myEvents = [];
	
	$scope.currentEvents = [];
	$scope.currentEvent = {};
	$scope.currentScreen = "upcoming";
	
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
				$scope.refreshEvents("");
           }
       })
   }
   
   
   $scope.refreshEvents = function(value){
		
		var session = $scope._getSession();
		var data = {};
		data.command = "getEventsByCampus";
				
		data.userSession=session.session;
		data.userId=session.user;
		data.universityId=$scope.campus.id
		
		var promise = $http.post($scope._serverUrl,data);

		promise.success(function(data, status, headers, config) {
			
			if(data.status == "success"){
				$scope.currentEvents = data.details.events;
				$scope.members = data.details.members;
				$scope._showAlert({status:1,message:""});
				if($routeParams.action){
					var index = $scope._arrayObjectIndexOf($scope.currentEvents,$routeParams.action,"eventId");
					if(index>-1) $scope.setCurrentEvent(index)
				}
			}
			else{
				$scope._showAlert({status:3,message:$scope._labels.alerts_loadingEventsFailure});
			}
                        
		})
	}
	
	$scope.getEventDetails = function(event){
		
		var session = $scope._getSession();
		var data = {eventId:event.eventId,command:"getEventDetails"};
		data.userSession=session.session;
		data.userId=session.user;
		
		var promise = $http.post($scope._serverUrl,data);

		promise.success(function(data, status, headers, config) {

			if(data.status == "success"){
				$scope.currentEvent.details = data.details;
				
			}
		});
	}
	
	$scope.setCurrentEvent = function(id){
		if(id==-1) $scope.currentEvent = {id:null}
		else {
			$scope.currentEvent = $scope.currentEvents[id];
			$scope.getEventDetails($scope.currentEvent);
		}
	}
 
   $scope.init = function(){
        $scope.getUnivs();
    }
    
   $scope.init();
}]);