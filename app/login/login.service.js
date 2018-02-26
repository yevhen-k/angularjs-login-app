'use strict';


// https://www.youtube.com/watch?v=wA0gZnBI8i4 $q
// https://www.youtube.com/watch?v=s6SH72uAn3Q promises js
angular.module('login').factory('LoginService', function ($rootScope, localStorageService, $http) {
  // инициализируем текущего пользователя
  var currentUser = {};
  $rootScope.currentUser = {};

  return {
    login: function (email, password) {
      // отправить запрос на сервер методом POST
      // и вернуть promise
      console.log('in LoginService.login');
      var credentials = {};
      credentials.email = email;
      credentials.password = password;
      return $http.post('http://localhost:3001/login', credentials);
    },
    logout: function() {
      return $http.post('http://localhost:3001/logout', currentUser);
    },
    isAuthenticated: function() {
      var cookie = 'SID' + '=' + localStorageService.get('SID');
      var credentials = {
        email: currentUser.email,
        cookie: cookie
      };
      console.log('cookie in isAuthenticated()', cookie);
      return $http.post('http://localhost:3001/validatesession', credentials);
    },
    initializeUser: function(id, name, email) {
      currentUser.id = id;
      currentUser.name = name;
      currentUser.email = email;
      console.log('current user', currentUser);
    },
    getName: function() {
      return currentUser.name;
    },
    getEmail: function() {
      return currentUser.email;
    },
    getId: function() {
      return currentUser.id;
    },
    getCurrentUser: function() {
      return currentUser;
    }
  };

});