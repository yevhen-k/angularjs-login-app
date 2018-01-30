'use strict';

angular.module('home')
.controller('HomeController', function($scope, $rootScope, $stateParams, $state, LoginService, localStorageService) {
  $rootScope.title = "AngularJS Home Page";
  $scope.name = $rootScope.currentUser.name;
  $scope.id = $rootScope.currentUser.id;
  
  $scope.logOut = function() {
    $rootScope.currentUser.isCurrentlyActive = false;
    localStorageService.set($rootScope.currentUser.id, $rootScope.currentUser);
  };
});