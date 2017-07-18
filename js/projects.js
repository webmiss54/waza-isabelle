'use strict';

/* Controllers */

root.controller('AdminProjectsCtrl' ,['$scope','$http', function($scope,$http) {
        
    $scope.discoverType = []
    $scope.currentSector = 0;
    $scope.listSectors = [{id:0,label:$scope._labels.allSectors}];
    $scope.listLocations = [];
    $scope.currentLocation = "";
    $scope.currentType = 0;
    $scope.listing = [];
    $scope.moreToFetch = true;
        
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
                           $scope.campus = {"id":campus.id,"settings":{},"articles":{},name:campus.name,ownerId:campus.ownerId};
                           $scope.getSectors();
                           $scope.refreshListing();
                           break;
                       }
                   }
                
           }
       })
    }
    
    $scope.getSectors = function(){

        $http.post($scope._serverUrl,{command:"getUniversityProjectSectors",userSession:$scope._getSession().session,userId:$scope._getSession().user}).success(function(data, status, headers, config) {
            $scope._showAlert({status:2,message:""})
            $scope.listSectors = [{id:0,label:$scope._labels.allSectors}];
            if(data.status == "success"){
                $scope.listSectors = $scope.listSectors.concat(data.details);
                $scope.currentSector = 0;
                
               $scope._showAlert({status:1,message:""})
            }
            else{

                $scope._showAlert({status:3,message:""})

            }


        });
    }
    
    $scope.setSector = function(sector){
        $scope.currentSector = sector.id;
        $scope.refreshListing();
    }
    
    $scope.setType = function(type){
        $scope.currentType = $scope._arrayObjectIndexOf($scope.discoverType,type.code,"code") ;
        $scope.refreshListing();
    }
    
    $scope.setFilt = function(filter){
        $scope.currentFilt = filter;
        $scope.refreshListing();
    }
    
    $scope.refresh = function(){
        $scope.refreshListing(false);
    }
    
    $scope.refreshListing = function(append){
        var begin = 0;
        if(append){
            begin = $scope.listing.length;
        }
        else{
            $scope.listing =[];
        }
        var count = 20;
        var cat = $scope.discoverCat[0].label;
        var attr = {userSession:$scope._getSession().session,userId:$scope._getSession().user,searchInput:$scope.searchInput,begin:begin,count:count,filter:$scope.currentFilt};
        attr.command = "projectListing";
        attr.type = $scope.discoverType[$scope.currentType].code;  
        attr.univId= $scope.campus.id;
        
        $http.post($scope._serverUrl,attr).success(function(data, status, headers, config) {
            $scope._showAlert({status:2,message:""})
            
            if(data.status == "success"){
               if(data.details.length<count){
                   $scope.moreToFetch = false;
               } 
               else $scope.moreToFetch = true;
               
               var list = [];
               list = data.details.map($scope.formatProject);
               
               if(append) $scope.listing = $scope.listing.concat(list);
               else  $scope.listing = list;
               
               $scope._showAlert({status:1,message:""})
            }
            else{

                $scope._showAlert({status:3,message:""})

            }


        });
    }
    
    $scope.formatProject = function(project){
            
        if(project.thumbnailUrl) project.mainThumbnail = project.thumbnailUrl
        else project.mainThumbnail = $scope._urls.defaultImg;

        if(project.lastModified) project.date = new Date(project.lastModified);

        if(!project.type) {
            project.typeIcon = "6";
        }
        else{
            $scope._log("project type",project.type);
            switch(project.type){
                case "academic":project.typeIcon = "3"; break;
                case "asso":project.typeIcon = "4"; break;
                case "startup":project.typeIcon = "5"; break;
                case "other":project.typeIcon = "6"; break;
            }
        }
        
        return project;
    }
    
    $scope.init = function(){
        $scope.discoverCat = [{label:"project",orders:["alphabetic", "mostRecent", "mostMembers","mostFollowers"]}];
        $scope.currentFilt = $scope.discoverCat[0].orders[0];
        $scope.listLocations = [{code:"all",name:$scope._labels.everywhere}];
        $scope.discoverType = [{code:"all",label:"projectTypes.all"},{code:"academic",label:"academicShort"},{code:"asso",label:"projectTypes.asso"},{code:"startup",label:"projectTypes.startup"},{code:"other",label:"projectTypes.other"}]
        
        $scope.getUnivs();
    }
    $scope.init();
        
}]);