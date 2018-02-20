'use strict';


// https://www.youtube.com/watch?v=wA0gZnBI8i4 $q
// https://www.youtube.com/watch?v=s6SH72uAn3Q promises js
angular.module('login').factory('LoginService', function ($rootScope, localStorageService, $http) {

  /*
  var users = [
    {
      id: 0,
      name: 'First',
      email: 'first@example.com',
      password: 'first',
      isBlocked: false,
      isCurrentlyActive: false
    },
    {
      id: 1,
      name: 'Second',
      email: 'second@example.com',
      password: 'second',
      isBlocked: false,
      isCurrentlyActive: false
    },
    {
      id: 2,
      name: 'Blocked',
      email: 'blocked@example.com',
      password: 'blocked',
      isBlocked: true,
      isCurrentlyActive: false
    }
  ];
  */
  // инициализируем текущего пользователя
  var users = [];
  $rootScope.currentUser = {};
  var isAuthenticated = false;

  return {
    prefecthUsers: function () {
      // заполняем $rootScope зарегистрированными пользователями
      $rootScope.registeredUsers = [];
      console.log('prefetch');
      console.log('$rootScope.registeredUsers:');
      for (var i = 0; i < localStorageService.length(); i++) {
        $rootScope.registeredUsers[i] = localStorageService.get(i);
        console.log($rootScope.registeredUsers[i]);
        if ($rootScope.registeredUsers[i].isCurrentlyActive) {
          $rootScope.currentUser = $rootScope.registeredUsers[i];
        }
      }
      console.log('end prefetch');
    },
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
      console.log('in LoginService.login');
      console.log('$rootScope.registeredUsers.length: ' + $rootScope.registeredUsers.length);
      console.log(email + " " + password);
      console.log($rootScope.registeredUsers);
      for (var i = 0; i < $rootScope.registeredUsers.length; i++) {
        console.log($rootScope.registeredUsers[i]);
        // проверка правильности введенных логина и пароля, а также проверка заблокирован ли пользователь
        if ($rootScope.registeredUsers[i].email == email && $rootScope.registeredUsers[i].password == password && !$rootScope.registeredUsers[i].isBlocked) {
          $rootScope.currentUser = $rootScope.registeredUsers[i];
          $rootScope.currentUser.isCurrentlyActive = true;
          localStorageService.set($rootScope.currentUser.id, $rootScope.currentUser);
          console.log("$rootScope.currentUser");
          console.log($rootScope.currentUser);
          isAuthenticated = true;
          return isAuthenticated;
        }
        // проверка, является ли пользователь уже залогиненым
        if ($rootScope.registeredUsers[i].isCurrentlyActive) {
          isAuthenticated = true;
          return isAuthenticated;
        }
      }
      return isAuthenticated;
    }
    // ,
    // isAuthenticated : function() {
    //   for(var i = 0; i < $rootScope.registeredUsers.length; i++) {
    //     // проверка, является ли пользователь уже залогиненым
    //     // console.log('$rootScope.registeredUsers[i].isCurrentlyActive: ' + $rootScope.registeredUsers[i].isCurrentlyActive)
    //     if ($rootScope.registeredUsers[i].isCurrentlyActive) {
    //       $rootScope.currentUser = $rootScope.registeredUsers[i];
    //       isAuthenticated = true;
    //       return isAuthenticated;
    //     }
    //   }
    //   return isAuthenticated;
    // }
  };

});