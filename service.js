var app = angular.module('myApp', []);
				app.controller('myCtrl', function($scope, $http, $location) {

				    var token = localStorage.getItem('access_token');
				    var document_id = $location.search().id;

				    $scope.load = function() {
				        if(token==""){
				            window.location = "/user/login";
				        }else{
				            window.location = "/";
				        }
				    }

				    $scope.userLogin = function(){
				        $('.title-error').html('');
				        $scope.firstname = this.firstname;
				        $scope.lastname = this.lastname;
				        if($scope.firstname!="" && $scope.lastname!=""){
				            $http({
				                method : "POST",
				                url : "https://alpha-dataflownode.zerionsoftware.com/code_assignment/register",
				                handleError:true,
				                data : {
				                    firstName :$scope.firstname,
				                    lastName : $scope.lastname,
				                },
				                headers: {
				                    'Accept' : 'application/json'
				                }
				            })
				            .then(function(response) {
				                if(response.data.accessToken!=""){
				                    localStorage.setItem('access_token',response.data.accessToken);
				                    window.location = "/get-documents.html";
				                }
				                if(response.data.accessToken===""){
				                    $('.title-error').html('Invalid Credenttials');
				                }
				            });
				        }
				    }


				    $scope.load = function() {
                        if(token!=null){
                            angular.element(document.querySelector('.register')).addClass('hidden');
                            $http({
                                method : "GET",
                                url : "https://alpha-dataflownode.zerionsoftware.com/code_assignment/records",
                                headers: {
                                    'Authorization' : "Bearer "+token
                                },
                            })
                            .then(function(response) {
                                if(response.data.length > 0){
                                    $scope.documents = response.data;
                                    angular.element(document.querySelector('.no-document')).removeClass('hidden');
                                }
                            });
                            angular.element(document.querySelector('.logout')).removeClass('hidden');
                            angular.element(document.querySelector('.create-document')).removeClass('disabled');
                        }
                        else{
                            angular.element(document.querySelector('.create-document')).addClass('disabled');
                            angular.element(document.querySelector('.logout')).addClass('hidden');
                        }
                    }


                    $scope.userRegister = function(){
                        $('.title-error').html('');
                        $scope.firstname = this.firstname;
                        $scope.lastname = this.lastname;
                        if($scope.firstname!=null && $scope.lastname!=null){
                            $http({
                                method : "POST",
                                url : "https://alpha-dataflownode.zerionsoftware.com/code_assignment/register",
                                handleError:true,
                                data : {
                                    firstName :$scope.firstname,
                                    lastName : $scope.lastname,
                                },
                                headers: {
                                    'Accept' : 'application/json'
                                }
                            })
                            .then(function(response) {
                                if(response.data.accessToken!=""){

                                    $(".firstname-error").html("");
                                    $(".lastname-error").html("");
                                    localStorage.setItem('access_token',response.data.accessToken);
                                    window.location = "get-documents.html";
                                }
                                if(response.data.accessToken===""){
                                    $('.title-error').html('Invalid Credenttials');
                                }
                            });
                        }
                        else{
                            if(this.firstname==null){
                                $(".firstname-error").html("Name cannot be empty");
                            }
                            if(this.lastname==null){
                                $(".lastname-error").html("Description cannot be empty");
                            }
                        }
                    }

                    $scope.getDocumentData = function(){
                        $scope.document_id = this.item._id;
                        $scope.editName = this.item.name;
                        $scope.editDescription = this.item.description;
                        $scope.editImgs = this.item.imgs[0].url;
                    };

                    $scope.updateDocument = function(){
                        if(this.editName!=null && this.editDescription!=null && this.editImgs!=null){
                            $http({
                                method : "PUT",
                                url : "https://alpha-dataflownode.zerionsoftware.com/code_assignment/records/"+this.document_id,
                                data : {
                                    name : this.editName,
                                    description : this.editDescription,
                                    imgs : [
                                        {
                                            url : this.editImgs                                        
                                        },
                                    ]
                                },
                                headers: {
                                    'Authorization' : "Bearer "+token,
                                    'Accept' : 'application/json'
                                }
                            })
                            .then(function(response) {
                                if(response.status===200){
                                    var documents = response.config.data;
                                    var document_id = response.data.id;
                                    for(var i=0;i < $scope.documents.length;i++){
                                        if(document_id==$scope.documents[i]._id){
                                            $scope.documents[i].name= documents.name;
                                            $scope.documents[i].description = documents.description;
                                            $scope.documents[i].imgs[0].url = documents.imgs[0].url;
                                            break;
                                        }
                                    }
                                }
                            });
                            $(".all-error").html("");
                        }
                        else{
                            $(".all-error").html("All fields are mandatory.");
                        }
                    }

                    $scope.deleteDocument = function(){
                        $http({
                            method : "DELETE",
                            url : "https://alpha-dataflownode.zerionsoftware.com/code_assignment/records/"+this.document_id,
                            headers: {
                                'Authorization' : "Bearer "+token,
                            }
                        })
                        .then(function(response) {
                            if(response.status===200){
                                var document_id = response.data.id;
                                angular.element(document.querySelector('.document_'+ document_id)).remove();
                            }
                        });
                    }


$scope.load = function() {
                        if(token==null){
                            window.location = "get-documents.html";
                        }
                    }

                    if(document_id==null){
                        angular.element(document.querySelector('.document_edit')).addClass('hidden');
                        angular.element(document.querySelector('.document_create')).removeClass('hidden');
                    }
                    else{
                        angular.element(document.querySelector('.document_create')).addClass('hidden');
                        angular.element(document.querySelector('.document_edit')).removeClass('hidden');

                        $http({
                            method : "GET",
                            url : "https://alpha-dataflownode.zerionsoftware.com/code_assignment/records/"+document_id,
                            headers: {
                                'Authorization' : "Bearer "+token
                            },
                        })
                        .then(function(response) {
                            $scope.document_id = response.data._id;
                            $scope.editName = response.data.name;
                            $scope.editDescription = response.data.description;
                            $scope.editImgs = response.data.imgs[0].url;
                        });
                    }

                    $scope.createDocument = function(){

                        if(this.name!=null && this.description!=null && this.imgs!=null){
                            $http({
                                method : "POST",
                                url : "https://alpha-dataflownode.zerionsoftware.com/code_assignment/records",
                                data : {
                                    name : this.name,
                                    description : this.description,
                                    imgs : [
                                        {
                                            url : this.imgs                                        
                                        },
                                    ]
                                },
                                headers: {
                                    'Authorization' : "Bearer "+token,
                                    'Accept' : 'application/json'
                                }
                            })
                            .then(function(response) {
                                if(response.data.id!=""){
                                    window.location = "get-documents.html";
                                }
                                else{
                                    $(".name-error").html("Error creating your Document.");
                                }
                            },function(error){
                                $(".name-error").html("Error creating your Document.");
                            });
                        }else{

                            if(this.name==null){
                                $(".name-error").html("Name cannot be empty");
                            }
                            if(this.description==null){
                                $(".description-error").html("Description cannot be empty");
                            }
                            if(this.imgs==null){
                                $(".imgs-error").html("Image URL cannot be empty");
                            }
                        }
                    }

                    $scope.updateDocument = function(){
                        if(this.editName!=null && this.editDescription!=null && this.editImgs!=null){
                            $http({
                                method : "PUT",
                                url : "https://alpha-dataflownode.zerionsoftware.com/code_assignment/records/"+this.document_id,
                                data : {
                                    name : this.editName,
                                    description : this.editDescription,
                                    imgs : [
                                        {
                                            url : this.editImgs                                        
                                        },
                                    ]
                                },
                                headers: {
                                    'Authorization' : "Bearer "+token,
                                    'Accept' : 'application/json'
                                }
                            })
                            .then(function(response) {
                                if(response.status===200){
                                    window.location = "get-documents.html";
                                }
                            });
                        }
                        else{
                            if(this.editName==null){
                                $(".name-error").html("Name cannot be empty");
                            }
                            if(this.editDescription==null){
                                $(".description-error").html("Description cannot be empty");
                            }
                            if(this.editImgs==null){
                                $(".imgs-error").html("Image URL cannot be empty");
                            }
                        }
                    }

                    $scope.deleteDocument = function(){
                        $http({
                            method : "DELETE",
                            url : "https://alpha-dataflownode.zerionsoftware.com/code_assignment/records/"+this.document_id,
                            headers: {
                                'Authorization' : "Bearer "+token,
                            }
                        })
                        .then(function(response) {
                            console.log(response);
                            if(response.status===200){
                                window.location = "get-documents.html";
                            }
                        });
                    }
				});