'use strict';

angular.module('home')
.controller('HomeController', function($scope, $rootScope, $stateParams, $state, LoginService, localStorageService) {
  $rootScope.title = "AngularJS Home Page";
  this.name =LoginService.getName();
  this.id = LoginService.getId();
  
  $scope.logOut = function() {
    localStorageService.set('SID', '');
    LoginService.logout();
  };
});