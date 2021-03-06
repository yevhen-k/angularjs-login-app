'use strict';

angular.module('register')
.controller('RegisterController', function($scope, $rootScope, $stateParams, $state, LoginService, RegisterService, localStorageService) {
  $rootScope.title = "AngularJS Register Sample";

  $scope.isValidEmail = function() {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test($scope.email);
  };

  $scope.isPasswordsMatch = function() {
    if ($scope.passwordConfirm == '' || $scope.password == '') {
      return false;
    }
    if ($scope.passwordConfirm !== $scope.password) {
      return false;
    }
    return true;
  };

  $scope.formRegisterSubmit = function () {
    LoginService.fetchUsers()
      .then(function(){
        if(RegisterService.register($scope.userName, $scope.email, $scope.password, $scope.passwordConfirm)) {
          $scope.userName = '';
          $scope.email = '';
          $scope.password = '';
          $scope.passwordConfirm = '';
          $rootScope.toStateName = 'home';
          $state.transitionTo('home');
        } else {
          $scope.error = "User is already exists!";
        }
      });
    
  }
});