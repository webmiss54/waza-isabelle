'use strict';

/* Controllers */

root.controller('AdminUsersCtrl' ,['$scope','$http', function($scope,$http) {
    
        
    $scope.listAlumni=[];    
    $scope.listStudents = []
    $scope.currentUser = null;
    $scope.usersList = [];
    $scope.listTutors = [];
    $scope.listAdmins = [];
    $scope.currentUser = null;
    $scope.currentScreen='admins';

	$scope._labels ={
		adminPlan: 'adminPlan',
		studentPlan: 'studentPlan',
		tutorPlan: 'tutorPlan',
		alumni: 'alumni',
        memberAddBtn: 'memberAddBtn',
        memberDelBtn: 'memberDelBtn',
        confirmNewStudent:'confirm',
        confirmEditStudent:'confirm',
        memberEditBtn: 'memberEditBtn'
	}

    $scope._getSession = function() { return {}}


    $scope.currentList = function(){
       
        switch($scope.currentScreen){
            case "admins": return $scope.listAdmins; break;
            case "students": return $scope.listStudents; break;
            case "tutors": return $scope.listTutors; break;
            case "alumni": return $scope.listAlumni; break;
                
        }
    }

    $scope.listStudents =
    $scope.listAdmins = 
    $scope.listTutors = 
    $scope.listAlumni=
    [
        {
        avatar : 'http://via.placeholder.com/350x150',
        shortName: 'John Doe'
    },
    {
        avatar : 'http://via.placeholder.com/350x150',
        shortName: 'Jane Doe'
        }
    ]

    $scope._formatUser = function(u) {return u}
    
    

    $scope.refresh = function(){
        $scope.fetchAdmins();
        $scope.fetchStudents();
        $scope.fetchManagers();
        $scope.fetchAlumni();
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
    
    $scope.fetchAdmins =function(){
        $http.post($scope._serverUrl,{command:"getUniversityUsers",userSession:$scope._getSession().session,userId:$scope._getSession().user,univId:$scope.campus.id,type:"admin",filter:$scope.searchInput}).success(function(data, status, headers, config) {
        $scope._showAlert({status:2,message:""})
        $scope.listAdmins = [];
        if(data.status == "success"){
            $scope._showAlert({status:1,message:""})
            var i
            for (i=0;i<data.details.length;i++){
                $scope.listAdmins.push((data.details[i]))
            }
        }
        else{

            $scope._showAlert({status:3,message:""})
        }
    });
    }

    $scope.fetchAlumni = function(){

        $http.post($scope._serverUrl,{command:"getUniversityUsers",userSession:$scope._getSession().session,userId:$scope._getSession().user,univId:$scope.campus.id,type:"alumni",filter:$scope.searchInput}).success(function(data, status, headers, config) {
        $scope._showAlert({status:2,message:""})
        $scope.listAlumni = [];
        if(data.status == "success"){
            $scope._showAlert({status:1,message:""})
            var i
            for (i=0;i<data.details.length;i++){
                $scope.listAlumni.push((data.details[i]))
            }
        }
        else{

            $scope._showAlert({status:3,message:""})
        }
    });
    }
    
    $scope.fetchManagers = function(){

        $http.post($scope._serverUrl,{command:"getUniversityUsers",userSession:$scope._getSession().session,userId:$scope._getSession().user,univId:$scope.campus.id,type:"managers",filter:$scope.searchInput}).success(function(data, status, headers, config) {
            $scope._showAlert({status:2,message:""})
            $scope.listTutors = [];
            if(data.status == "success"){
                $scope._showAlert({status:1,message:""})
                var i
                for (i=0;i<data.details.length;i++){
                    $scope.listTutors.push((data.details[i]))
                }
            }
            else{

                $scope._showAlert({status:3,message:""})
            }
        });
    }

    $scope.newManager = function(email,firstName,lastName,position){
        var data ={command:"addUniversityManagerByMail",userSession:$scope._getSession().session,userId:$scope._getSession().user,email:email,firstName:firstName,lastName:lastName};
        
        $http.post($scope._serverUrl,data).success(function(data, status, headers, config) {
            $scope._showAlert({status:2,message:""})
            
            if(data.status == "success"){
                $scope._showAlert({status:1,message:""})
                $scope.refresh();
                $scope.closeModalNewManager()
            }
            else{

                $scope._showAlert({status:3,message:""})

            }
        });

    }
    $scope.openModalNewManager = function(){
        $scope.addManagerPanel=true;$scope.detailsManagerPanel=false;
        $("#newManagerModal").removeClass("hide")
        $("#newManagerModal").show()
    }

    $scope.closeModalNewManager = function(){
        $scope.addManagerPanel = false;
        $("#newManagerModal").hide()
    }
    
    $scope.deleteStudent = function(){        
    alert("Veuillez confirmer la suppression");

    var txt;
    var r = confirm("Etes vous certain de vouloir supprimer ?!");
    if (r == true) {
        txt = "Suppression confirmée !";
    } else {
        txt = "Suppression abandonnée !";
    }
    document.getElementById("demo").innerHTML = txt;
    } 



    $scope.fetchStudents = function(){

        $http.post($scope._serverUrl,{command:"getUniversityUsers",userSession:$scope._getSession().session,userId:$scope._getSession().user,univId:$scope.campus.id,type:"students",filter:$scope.searchInput}).success(function(data, status, headers, config) {
            $scope._showAlert({status:2,message:""})
            $scope.listStudents = [];
            if(data.status == "success"){
                $scope._showAlert({status:1,message:""})
                var i
                for (i=0;i<data.details.length;i++){
                    $scope.listStudents.push((data.details[i]))
                }
            }
            else{

                $scope._showAlert({status:3,message:""})

            }
        });
    }

    $scope.newStudent = function(email,firstName,lastName){
        
        var params = {command:"addUniversityStudentByMail",userSession:$scope._getSession().session,userId:$scope._getSession().user,email:email,firstName:firstName,lastName:lastName};
        $http.post($scope._serverUrl,params).success(function(data, status, headers, config) {
            $scope._showAlert({status:2,message:""})
            if(data.status == "success"){
                $scope._showAlert({status:1,message:""})
                $scope.refresh();
                $scope.closeModalNewStudent()
            }
            else{

                $scope._showAlert({status:3,message:""})

            }
        });

    }
    
    $scope.newAdmin = function(email,firstName,lastName){
       
        var params = {command:"addUniversityAdminByMail",userSession:$scope._getSession().session,userId:$scope._getSession().user,email:email,firstName:firstName,lastName:lastName};
        $http.post($scope._serverUrl,params).success(function(data, status, headers, config) {
            $scope._showAlert({status:2,message:""})
            if(data.status == "success"){
                $scope._showAlert({status:1,message:""})
                $scope.refresh();
                $scope.closeModalNewAdmin()
            }
            else{

                $scope._showAlert({status:3,message:""})

            }
        });

    }
    
    $scope.newAlumni = function(email,firstName,lastName,organization){
        
        var params = {command:"addUniversityAlumniByMail",userSession:$scope._getSession().session,userId:$scope._getSession().user,email:email,firstName:firstName,lastName:lastName,organisation:organization};
        $http.post($scope._serverUrl,params).success(function(data, status, headers, config) {
            $scope._showAlert({status:2,message:""})
            if(data.status == "success"){
                $scope._showAlert({status:1,message:""})
                $scope.refresh();
                $scope.closeModalNewAlumni()
            }
            else{

                $scope._showAlert({status:3,message:""})

            }
        });

    }
    
    $scope.init = function(){
        $scope.getUnivs();
    }


    $scope.openModalNewStudent = function(){
        $scope.addStudentPanel=true;$scope.detailsStudentPanel=false;
        $("#newStudentModal").removeClass("hide")
        $("#newStudentModal").show()
    }

    $scope.openModalEditStudent = function(){
        $scope.editStudentPanel=true;$scope.detailsStudentPanel=false;
        $("#editStudentModal").removeClass("hide")
        $("#editStudentModal").show()
    }

    $scope.closeModalEditStudent = function(){
        $scope.editStudentPanel = false;
        $("#editStudentModal").hide()
    }

    $scope.closeModalNewStudent = function(){
        $scope.addStudentPanel = false;
        $("#newStudentModal").hide()
    }
    
    $scope.openModalNewAdmin = function(){
        
        $("#newAdminModal").removeClass("hide")
        $("#newAdminModal").show()
    }

    $scope.closeModalNewAdmin = function(){
        
        $("#newAdminModal").hide()
    }
    
    $scope.openModalNewAlumni = function(){
        
        $("#newAlumniModal").removeClass("hide")
        $("#newAlumniModal").show()
    }

    $scope.closeModalNewAlumni = function(){
        
        $("#newAlumniModal").hide()
    }

    $scope.showUserDetails = function(user) {
        $scope.currentUser = user;
        $("#detailsUserModal").removeClass("hide")
        $("#detailsUserModal").show()
    }
        
    $scope.onMailChange = function(val){
        if(val.length<3 || (val.length>3 && $scope.usersList.length==0)) return;
        
        
        $http.post($scope._serverUrl,{command:"getUserByMail",userSession:$scope._getSession().session,userId:$scope._getSession().user,mail:val,fetchNames:true,like:true}).success(function(data, status, headers, config) {
            $scope._showAlert({status:2,message:""})
            if(data.status == "success"){
                $scope.usersList = data.details;
                $scope._showAlert({status:1,message:""})
                if(data.details.length){
                    $scope.inputFirstName = data.details[0]["firstName"];
                    $scope.inputLastName = data.details[0]["lastName"];
                }
                
            }
            else{

                $scope._showAlert({status:3,message:""})

            }
        });
    }
    
   // $scope.init();
        
}]);