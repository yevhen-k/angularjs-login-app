'use strict';


// https://www.youtube.com/watch?v=wA0gZnBI8i4 $q
// https://www.youtube.com/watch?v=s6SH72uAn3Q promises js
angular.module('login').factory('LoginService', function ($rootScope, localStorageService, $http) {
  // инициализируем текущего пользователя
  var currentUser = {};
  $rootScope.currentUser = {};

  return {
    fetchUsers: function () {
      return $http.get('http://localhost:3001/data/users').then(function (response) { // /data/users.json
        // заполняем localStorageService зарегистрированными пользователями
        console.log('fetchUsers');

        users = response.data;
        console.log("response.data");
        console.log(response.data);
        console.log('localStorageService.isSupported' + " " + localStorageService.isSupported);
        if (localStorageService.length() == 0) {
          console.log('localStorage is empty');
          for (var i = 0; i < users.length; i++) {
            var key = users[i].id;
            var val = users[i];
            console.log(key);
            console.log(val);
            localStorageService.set(key, val);
          }
        } else {
          for (var i = 0; i < users.length; i++) {
            var key = users[i].id;
            var val = users[i];
            if (localStorageService.get(key).email == val.email && localStorageService.get(key).password == val.password) {
              continue;
            }
            localStorageService.set(key, val);
          }
        }
        // заполним $rootScope.registeredUsers из localStorageService
        for (var i = 0; i < localStorageService.length(); i++) {
          $rootScope.registeredUsers[i] = localStorageService.get(i);
          console.log($rootScope.registeredUsers[i]);
          if ($rootScope.registeredUsers[i].isCurrentlyActive) {
            $rootScope.currentUser = $rootScope.registeredUsers[i];
          }
        }
        console.log('end fetchUsers');

        return response.data;
      });
    },
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