'use strict';

/* Controllers */

root.controller('UnivCompanyContacts' ,['$scope','$http','$routeParams', function($scope,$http,$routeParams) {
    
    $scope.contacts = {elements:[]};
    if(!$scope.entrepriseId) $scope.entrepriseId = $routeParams.entrepriseId;
    $scope.newElement = {organization:$scope.company.fullName};
    
    $scope.getStatus = function(){

        $http.post($scope._serverUrl,{command:"getContactAllStatus",userSession:$scope._getSession().session,userId:$scope._getSession().user}).success(function(data, status, headers, config) {
            $scope._showAlert({status:2,message:""})
            $scope.listStatus = [];
            if(data.status == "success"){
                $scope.listStatus = data.details
               $scope._showAlert({status:1,message:""})
            }
            else{

                $scope._showAlert({status:3,message:""})

            }


        });
    }

    $scope.getContacts = function (){

            $scope._log("get contacts");

            var data = {};
            data.command = "getUniversityEntrepriseContacts";
            var session = $scope._getSession();
            data.userSession=session.session;
            data.userId=session.user;
            data.universityId=$scope.campus.id;
            data.entrepriseId=$scope.entrepriseId;

            $scope.contacts.elements = [];
            var promise = $http.post($scope._serverUrl,data);

            promise.success(function(data, status, headers, config) {

                    if(data.status == "success"){
                            $scope.contacts.elements = data.details;
                            var i;
                            for(i=0;i<$scope.contacts.elements.length;i++){
                                if($scope.contacts.elements[i].params) $scope.contacts.elements[i].params = JSON.parse($scope.contacts.elements[i].params)
                            }

                    }
            })

    }
    $scope.addContact = function(){
        
        var data = {};
        data.command = "addUniversityEntrepriseContact";
        var session = $scope._getSession();
        data.userSession=session.session;
        data.userId=session.user;
        data.universityId=$scope.campus.id;
        data.entrepriseId=$scope.entrepriseId;
            
        data.element = $scope.newElement;

        var promise = $http.post($scope._serverUrl,data);
        promise.success(function(data, status, headers, config) {

                if(data.status == "success"){
                    $scope.getContacts();
                    $scope.currentSection='listContacts';
                }
                else{
                    
                }
        })
        
    }
    $scope.getStatus();
    $scope.getContacts();
    
}]);