'use strict';
// https://ru.stackoverflow.com/questions/610361
// https://github.com/grevory/angular-local-storage

 angular.module('login')
.controller('LoginController', function($scope, $rootScope, $stateParams, $state, LoginService, localStorageService, $q, $http) {
  $rootScope.title = "AngularJS Login Sample";
  
  // https://stackoverflow.com/questions/46155
  $scope.isValidEmail = function() {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test($scope.email);
  };

  function getUsers() {
    return $http.get('data/users.json').then(function(response) {
      return response.data;
    });
  }
  

  $scope.formSubmit = function() {
    LoginService.fetchUsers()
    .then(
      function(data) {
        if(LoginService.login($scope.email, $scope.password)) {
          console.log('login servce')
          // $scope.error = '';
          // $scope.email = '';
          // $scope.password = '';
          $state.transitionTo('home');
        } else {
          $scope.error = "User is not registered OR user is blocked!";
        }   
      }
    );
    
  };
  
});