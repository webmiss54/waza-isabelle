'use strict';

/* Controllers */

root.controller('AdminCompaniesCtrl' ,['$scope','$http','$routeParams', function($scope,$http,$routeParams) {
        
    $scope.companyList = [];
    $scope.entrepriseId = 0;
    $scope.filters = {};
	$scope.sort = {type:"name",order:"desc","date":"all"}
    
    $scope.currentList = function(){
       
        switch($scope.currentScreen){
            case "partner": return $scope.listPartnerCompanies; break;
            case "favourite": return $scope.listFavouriteCompanies; break;
            case "recommended": return $scope.listRecommendedCompanies; break;
                
        }
    }
    
    $scope.refresh = function(){
        
        $scope.fetchPartnerCompanies();
        $scope.fetchFavouriteCompanies();
        if($scope.entrepriseId){
            $scope.openModalCompanyDetails();
            $scope.getCompanyDetails($scope.entrepriseId)

        }
        else{
            
        }
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
                           $scope.campus = {"id":campus.id,"settings":{},"articles":{},name:campus.name,ownerId:campus.ownerId};
                           $scope.refresh();
                           break;
                       }
                   }
                
           }
       })
    }
    
    $scope.fetchFavouriteCompanies =function(){
        return;
        $http.post($scope._serverUrl,{command:"getUniversityCompanies",userSession:$scope._getSession().session,userId:$scope._getSession().user,univId:$scope.campus.id,filter:$scope.searchInput,type:"favourite"}).success(function(data, status, headers, config) {
            $scope._showAlert({status:2,message:""})
            $scope.listFavouriteCompanies = [];
            if(data.status == "success"){
                $scope._showAlert({status:1,message:""})
                var i
                for (i=0;i<data.details.length;i++){
                    $scope.listFavouriteCompanies.push((data.details[i]))
                }
            }
            else{

                $scope._showAlert({status:3,message:""})
            }
        });
    }
    
    $scope.fetchPartnerCompanies =function(){
        $http.post($scope._serverUrl,{command:"getUniversityCompanies",userSession:$scope._getSession().session,userId:$scope._getSession().user,univId:$scope.campus.id,filter:$scope.searchInput,type:"partner"}).success(function(data, status, headers, config) {
            $scope._showAlert({status:2,message:""})
            $scope.listPartnerCompanies = [];
            if(data.status == "success"){
                $scope._showAlert({status:1,message:""})
                var i
                for (i=0;i<data.details.length;i++){
                    $scope.listPartnerCompanies.push((data.details[i]))
                }
            }
            else{

                $scope._showAlert({status:3,message:""})
            }
        });
    }
	
	$scope.openModalCompanyFilter = function(){
        $scope.addCompanyPanel=false;$scope.detailsCompanyPanel=false;
        
        
        $scope.currentPage = "overview";
        $("#filterCompanyModal").removeClass("hide")
        $("#filterCompanyModal").show()
    }

    $scope.closeModalCompanyFilter = function(){
        $("#filterCompanyModal").hide()
    }
    
    $scope.openModalCompanySort = function(){
        $scope.addCompanyPanel=false;$scope.detailsCompanyPanel=false;
        
        
        $scope.currentPage = "overview";
        $("#sortCompanyModal").removeClass("hide")
        $("#sortCompanyModal").show()
    }

    $scope.closeModalCompanySort = function(){
        $("#sortCompanyModal").hide()
    }
    
    $scope.openModalCompanyDetails = function(){
        $scope.addCompanyPanel=false;$scope.detailsCompanyPanel=true;
        
        $scope.currentPage = "overview";
        $("#companyDetailsModal").removeClass("hide")
        $("#companyDetailsModal").show()
    }

    $scope.closeModalCompanyDetails = function(){
        $scope.detailsCompanyPanel = false;
        $("#companyDetailsModal").hide()
    }
    
    $scope.openModalNewCompany = function(){
        $scope.addCompanyPanel=true;$scope.detailsCompanyPanel=false;
        $("#newCompanyModal").removeClass("hide")
        $("#newCompanyModal").show()
    }

    $scope.closeModalNewCompany = function(){
        $scope.addCompanyPanel = false;
        $("#newCompanyModal").hide()
    }
    
    $scope.onInputChange = function(val){
        if(val.length<3 || (val.length>3 && $scope.companyList.length==0)) return;
       
        $http.post($scope._serverUrl,{command:"getEntreprises",userSession:$scope._getSession().session,userId:$scope._getSession().user,like:val}).success(function(data, status, headers, config) {
            $scope._showAlert({status:2,message:""})
            if(data.status == "success"){
                $scope.companyList = data.details;
                $scope._showAlert({status:1,message:""})
            }
            else{

                $scope._showAlert({status:3,message:""})

            }
        });
    }
    
    $scope.newCompany = function (company){
        var index = $scope._arrayObjectIndexOf($scope.companyList,company,"fullName");
        var type = $scope.currentScreen;
        if(index>-1){
            
            $http.post($scope._serverUrl,{command:"addUniversityCompany",userSession:$scope._getSession().session,userId:$scope._getSession().user,entrepriseId:$scope.companyList[index].id,univId:$scope.campus.id,type:type}).success(function(data, status, headers, config) {
                if(data.status == "success"){
                   $scope.refresh();
                   $scope.closeModalNewCompany();
                }

            });
        }
        else{
            var x = confirm($scope._labels.noCompanyWithNameCreationPrompt);
            if(x){
                var entreprise = {fullName:company}
            
                 $http.post($scope._serverUrl,{command:"addCompany",userSession:$scope._getSession().session,userId:$scope._getSession().user,company:entreprise}).success(function(data, status, headers, config) {
               
                if(data.status == "success"){
                    var entrepriseId = data.details;
                    $http.post($scope._serverUrl,{command:"addUniversityCompany",userSession:$scope._getSession().session,userId:$scope._getSession().user,entrepriseId:entrepriseId,univId:$scope.campus.id,type:type}).success(function(data, status, headers, config) {
                        if(data.status == "success"){
                           $scope.refresh();
                           $scope.closeModalNewCompany();
                        }

                    });
                    
                } });
            }
        }
    }
    
    $scope.init = function(){
        $scope.currentScreen='partner';
        $scope.entrepriseId = $routeParams.entrepriseId;
        $scope.getUnivs();   
        
    }
    
    $scope.getCompanyDetails = function(){
		
        var session = $scope._getSession();
        var data = {command:"getCompanyDetails",userSession:session.session,userId:session.user,entrepriseId:$scope.entrepriseId,universityId:$scope.campus.id};
        var promise = $http.post($scope._serverUrl,data);
        promise.success(function(data, status, headers, config) {
            if(data.status == "success"){
                $scope.company = data.details;
            }
            else{
            }
        })
    }
	
	$scope.sortCompanies  = function(){
		
		$scope.filterCompanies();
	}
    
    $scope.filterCompanies = function(){
        var session = $scope._getSession();
        if($scope.currentScreen=="favourite"){
            $scope.listFavouriteCompanies = [];
        }
        else {
            $scope.listPartnerCompanies = [];
        }

        var promise = $http.post($scope._serverUrl,{command:"getUniversityCompanies",userSession:$scope._getSession().session,userId:$scope._getSession().user,univId:$scope.campus.id,filters:$scope.filters,type:$scope.currentScreen,sort:$scope.sort}).success(function(data, status, headers, config) {
            console.log("search",data.details)
            
            
            if(data.status == "success"){
                $scope._showAlert({status:1,message:""})
                var i
                for (i=0;i<data.details.length;i++){
                    if($scope.currentScreen=="favourite") $scope.listFavouriteCompanies.push((data.details[i]))
                    else $scope.listPartnerCompanies.push((data.details[i]))
                }
                $scope.closeModalCompanyFilter();
            }
            else{

                $scope._showAlert({status:3,message:""})
            }
        });
    }
        
}]);