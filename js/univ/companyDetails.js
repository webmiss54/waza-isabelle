'use strict';

/* Controllers */

root.controller('AdminCompaniesDetailsCtrl' ,['$scope','$http','$routeParams', function($scope,$http,$routeParams) {
        
    $scope.currentElement = null;
	$scope.newField = null;
	
	$scope.init = function(){
		

        $http.post($scope._serverUrl,{command:"getEntrepriseMetas",userSession:$scope._getSession().session,userId:$scope._getSession().user,entrepriseId:$scope.entrepriseId,universityId:$scope.campus.id}).success(function(data, status, headers, config) {
            $scope._showAlert({status:2,message:""})
            
            if(data.status == "success"){
                $scope.metas = {};
				$scope.rawMetas = data.details;
				for(var key in $scope.rawMetas.metas){
					var val = $scope.rawMetas.metas[key];
					if(!val) val= $scope._labels.undefined;
					$scope.metas[key] = [{label:$scope._labels[key],value:val,custom:false,key:key}];
				}
				
				for(var key in $scope.rawMetas.customMetas.metas){
					var label = "";
					if($scope._labels.hasOwnProperty(key)) label = $scope._labels[key];
					else if($scope.rawMetas.customMetas.fields.hasOwnProperty(key)) label = $scope.rawMetas.customMetas.fields[key].label;
					if(label){
						
						var val = $scope.rawMetas.customMetas.metas[key][0].value;
						if(!val) val= $scope._labels.undefined;
						var elem = {value:val,label:label,custom:true,key:key,id:$scope.rawMetas.customMetas.metas[key][0].id,visibility:$scope.rawMetas.customMetas.metas[key][0].visibility,count:$scope.rawMetas.customMetas.metas[key].length};
						if(!$scope.metas.hasOwnProperty(key)) $scope.metas[key] = [];
						console.log(key,$scope.rawMetas.customMetas.metas[key],$scope.rawMetas.customMetas.fields);
							
						$scope.metas[key].unshift(elem);
					}
				}
				
				$scope._showAlert({status:1,message:""})
            }
            else{

                $scope._showAlert({status:3,message:""})

            }
        });
    
	}
	
	$scope.setCurrentElement = function(element){
		$scope.currentElement = element;
	}
	
	$scope.setField = function(element){
		$http.post($scope._serverUrl,{command:"setEntrepriseField",userSession:$scope._getSession().session,userId:$scope._getSession().user,entrepriseId:$scope.entrepriseId,universityId:$scope.campus.id,field:element}).success(function(data, status, headers, config) {
            
            if(data.status == "success"){
				$scope.init();
				$scope.setCurrentElement(null);
			}
		});
		
	}
	
	$scope.showNewField = function(){
		$scope.newField = {};
	}
	
	$scope.hideNewField = function(){
		$scope.newField =null;
	}
	
	$scope.submitNewField = function(){
		console.log($scope.newField);
		$http.post($scope._serverUrl,{command:"addUniversityEntrepriseCustomFields",userSession:$scope._getSession().session,userId:$scope._getSession().user,entrepriseId:$scope.entrepriseId,universityId:$scope.campus.id,field:$scope.newField}).success(function(data, status, headers, config) {
            
            if(data.status == "success"){
				$scope.init();
				$scope.hideNewField();
				$scope.setCurrentElement(null);
			}
		});
		
		//
	}
	
	$scope.deleteField = function(element){

		var r = confirm($scope._labels.confirmDeleteField);
		if (r == true) {
			
		} else {
			return false;
		}
		element.visiblity = 1;
		element.value = "";
		$scope.setField(element);
	}
        
	$scope.init();
}]);