'use strict';


// https://www.youtube.com/watch?v=R_okHflzgm0 AngularJS Tutorial #18 - Custom Directives
// https://www.youtube.com/watch?v=jHhtaJAdYv8 AngularJS Tutorial #23 - Form Validation (part 2)
angular.module('register').factory('RegisterService', function($rootScope, localStorageService, LoginService){
  var isRegisteredSuccessful = false;
  return {
    register: function(userName, email, password, passwordConfirm) {
      if(password !== passwordConfirm) {
        isRegisteredSuccessful = false;
        return isRegisteredSuccessful;
      }
      for(var i = 0; i < $rootScope.registeredUsers.length; i++) {
        if($rootScope.registeredUsers[i].email == email){
          isRegisteredSuccessful = false;
          return isRegisteredSuccessful;
        }
      }
      isRegisteredSuccessful = true;
      var newUser = {
        id: $rootScope.registeredUsers.length,
        name: userName,
        email: email,
        password: password,
        isBlocked: false,
        events: [
          {
            date: '28.01.2015',
            price: 25,
            participants: [
              'first',
              'second',
              'third'
            ]
          },
          {
            date: '12.10.2115',
            price: 12,
            participants: [
              'first',
              'second',
              'third'
            ]
          },
          {
            date: '05.05.1015',
            price: 10,
            participants: [
              'first',
              'second',
              'third'
            ]
          }
        ],
        isCurrentlyActive: true
      };
      localStorageService.set($rootScope.registeredUsers.length, newUser);
      $rootScope.registeredUsers.push(newUser);
      $rootScope.currentUser = newUser;
      LoginService.login($rootScope.currentUser.email, $rootScope.currentUser.password);
      return isRegisteredSuccessful;
    },
    isRegisteredSuccessful : function() {
      return isRegisteredSuccessful;
    }
  }
});