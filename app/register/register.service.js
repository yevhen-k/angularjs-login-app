'use strict';


// https://www.youtube.com/watch?v=R_okHflzgm0 AngularJS Tutorial #18 - Custom Directives
// https://www.youtube.com/watch?v=jHhtaJAdYv8 AngularJS Tutorial #23 - Form Validation (part 2)
angular.module('register').factory('RegisterService', function($rootScope, $http, localStorageService, LoginService){
  var isRegisteredSuccessful = false;
  return {
    register: function(userName, email, password, passwordConfirm) {
      var newUser = {
        id: $rootScope.registeredUsers.length,
        name: userName,
        email: email,
        password: password,
        isBlocked: false,
        events: [],
        isCurrentlyActive: true
      };      
      return $http.post('http://localhost:3001/newuser', newUser);
    },
    isRegisteredSuccessful : function() {
      return isRegisteredSuccessful;
    },
    isUserAlreadyExists : function(userName, email, password, passwordConfirm) {
      var isUserAlreadyExists = false;
      for(var i = 0; i < $rootScope.registeredUsers.length; i++) {
        if($rootScope.registeredUsers[i].email == email){
          var isUserAlreadyExists = true;
          return isUserAlreadyExists;
        }
      }
      return isUserAlreadyExists;
    }
  }
});