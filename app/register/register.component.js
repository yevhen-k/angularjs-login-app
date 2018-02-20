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
        if(!RegisterService.isUserAlreadyExists($scope.userName, $scope.email, $scope.password, $scope.passwordConfirm)) {
          RegisterService.register($scope.userName, $scope.email, $scope.password, $scope.passwordConfirm)
          .success(function (result) {
            console.log('User successfully saved to backend');
            var newUser = {
              id: $rootScope.registeredUsers.length,
              name: $scope.userName,
              email: $scope.email,
              password: $scope.password,
              isBlocked: false,
              events: [],
              isCurrentlyActive: true
            };    
            localStorageService.set($rootScope.registeredUsers.length, newUser);
            $rootScope.registeredUsers.push(newUser);
            $rootScope.currentUser = newUser;
            LoginService.login($rootScope.currentUser.email, $rootScope.currentUser.password);
            $scope.userName = '';
            $scope.email = '';
            $scope.password = '';
            $scope.passwordConfirm = '';
            $rootScope.toStateName = 'home';
            $state.transitionTo('home');
          })
          .error(function (result) {
            console.log('Error in user post', result);
            $scope.error = "Error in user registration process!";
          });
        } else {
          $scope.error = "User is already exists!";
        }
      });
    
  }
});