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

  
  $scope.formSubmit = function() {
    LoginService.login($scope.email, $scope.password)
      .then(function(responseFromServer){
        // if user not found on server then responseFromServer.data.length == 0
        // else responseFromServer.data.length == 1
        if(responseFromServer.data.length === 0) {
          $scope.error = "User is not registered OR user is blocked!";
        } else {
          console.log('response data from server',responseFromServer);
          console.log('data array length', responseFromServer.data.length);
          console.log(responseFromServer.data.email);
          console.log(responseFromServer.data.password);
          var key = responseFromServer.data.cookie.split("=")[0];
          var val = responseFromServer.data.cookie.split("=")[1];
          localStorageService.set(key, val);
          // initialize current user
          LoginService.initializeUser(responseFromServer.data.id,
              responseFromServer.data.name,
              responseFromServer.data.email
          );
          $state.transitionTo('home');
        }
      });
  };
});