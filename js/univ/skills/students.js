'use strict';

/* Controllers */

root.controller('AdminUnivSkillsStudents' ,['$scope','$http','$dropListService', function($scope,$http,$dropListService) {

    $scope.init = function(){
        $dropListService.onFetchU($scope,function(result){
            alert(JSON.stringify(result))
        });

        $dropListService.setFiltersU("searchInMainUniversity",true)
    }

           
}])