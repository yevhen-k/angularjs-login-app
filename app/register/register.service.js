'use strict';


// https://www.youtube.com/watch?v=R_okHflzgm0 AngularJS Tutorial #18 - Custom Directives
// https://www.youtube.com/watch?v=jHhtaJAdYv8 AngularJS Tutorial #23 - Form Validation (part 2)
angular.module('register').factory('RegisterService', function($rootScope, $http, localStorageService, LoginService){
  var isRegisteredSuccessful = false;
  return {
    register: function(userName, email, password) {
      var newUser = {
        name: userName,
        email: email,
        password: password,
        isBlocked: false,
        events: [],
      };      
      return $http.post('http://localhost:3001/register', newUser);
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