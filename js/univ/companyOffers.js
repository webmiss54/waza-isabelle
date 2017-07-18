'use strict';

/* Controllers */

root.controller('UnivCompanyOffers' ,['$scope','$http','$routeParams', function($scope,$http,$routeParams) {
    
    $scope.offers = {elements:[]} 
    $scope.newOffer = {source:"waza"};
    
    if(!$scope.entrepriseId) $scope.entrepriseId = $routeParams.entrepriseId;
    
    $scope.setSection = function(val){
        $scope.currentSection = val;
		
        if(val=="listKeywords"){
            var session = $scope._getSession();
            var data = {command:"getOfferAllKeywords",userSession:session.session,userId:session.user,entrepriseId:$scope.entrepriseId};
            var promise = $http.post($scope._serverUrl,data);
            promise.success(function(data, status, headers, config) {
                if(data.status == "success"){
                    var words = Object.keys(data.details).map(function(element){
                        return  {text: element, weight: Math.min(200,10*data.details[element])}
                    })
                    
                    $('#keywords').jQCloud(words);
                }
                else{
                }
            })
            
            
        }
    }

    $scope.refreshOffers = function(){
        var session = $scope._getSession();
        var data = {command:"getCompanyOffers",userSession:session.session,userId:session.user,entrepriseId:$scope.entrepriseId,refresh:true};
        var promise = $http.post($scope._serverUrl,data);
        promise.success(function(data, status, headers, config) {
            if(data.status == "success"){
                $scope.offers.elements =data.details.map(function(element){
                    element.id = parseInt(element.id);
                    return element;
                });
            }
            else{
            }
        })
    }
    $scope.init = function(){
        
        $scope.newOffer = {source:"waza"};
        var session = $scope._getSession();
        var data = {command:"getCompanyOffers",userSession:session.session,userId:session.user,entrepriseId:$scope.entrepriseId};
        var promise = $http.post($scope._serverUrl,data);
        promise.success(function(data, status, headers, config) {
            if(data.status == "success"){
                $scope.offers.elements =data.details;
            }
            else{
            }
        })
    
    }
    
    $scope.addOffer = function(){
        var session = $scope._getSession();
        var data = {command:"addCompanyOffer",userSession:session.session,userId:session.user,entrepriseId:$scope.entrepriseId,offer:$scope.newOffer}
        var promise = $http.post($scope._serverUrl,data);
        promise.success(function(data, status, headers, config) {
            if(data.status == "success"){
                var offerId = data.details;
                data = {command:"addUniversityEntrepriseOffer",userSession:session.session,userId:session.user,offerId:offerId,universityId:$scope.campus.id}
                var promise = $http.post($scope._serverUrl,data);
                promise.success(function(data, status, headers, config) {
                    if(data.status == "success"){
                        $scope.init();
                        $scope.currentSection='listOffers';
                    }
                    else{
                    }
                })
            }
            else{
            }
        })
    }
	
	$scope.downloadOffer = function(offer){
		var session = $scope._getSession();
        var data = {command:"downloadOffer",userSession:session.session,userId:session.user,offerId:offer.id}
        var promise = $http.post($scope._serverUrl,data);
        promise.success(function(data, status, headers, config) {
            if(data.status == "success"){
                window.open($scope._serverUrl+data.details,"_blank");
            }
            else{
            }
        })
		
	}
    $scope.init();
    
    
}])