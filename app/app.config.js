'use strict';

var loginApp = angular.module('loginApp');
loginApp
  .config(function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('loginAppPrefix');
    // localStorageServiceProvider.setStorageCookieDomain('example.com');
    localStorageServiceProvider.setStorageType('sessionStorage');
    localStorageServiceProvider.setNotify(true, true);
  })
  .config(['$urlRouterProvider', '$stateProvider', '$locationProvider', 'localStorageServiceProvider',
    function ($urlRouterProvider, $stateProvider, $locationProvider, localStorageServiceProvider) {

      $urlRouterProvider.otherwise('/');

      $stateProvider
        .state('login', {
          url: '/',
          templateUrl: 'login/login.template.html',
          controller: 'LoginController',
          authRequired: false
        }).state('register', {
          url: '/register',
          templateUrl: 'register/register.template.html',
          controller: 'RegisterController',
          authRequired: false
        }).state('home', {
          url: '/home',
          templateUrl: 'home/home.template.html',
          controller: 'HomeController',
          authRequired: true
        });

      // $locationProvider.html5Mode(true);
      $locationProvider.hashPrefix = '!';

    }]);


// https://codepen.io/jayeshcp/pen/JXrOgy
// https://github.com/angular-ui/ui-router/issues/2932
// https://github.com/angular-ui/ui-router/issues/2932#issuecomment-312864844
// https://ui-router.github.io/guide/ng1/migrate-to-1_0#state-change-events
// при перезагрузке страницы $rootscope обновляется, т.к. это эквивалентно перезапуску приложения
// https://www.octobot.io/blog/2016-11-25-angularjs-ui-router-per-view-authorization/
loginApp.run(function ($rootScope, $location, $state, localStorageService, RegisterService, LoginService) {
  LoginService.prefecthUsers();
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    // event.preventDefault();
    console.log('---------------------------------------');
    console.log('Changed state from: ');
    console.log(fromState);
    console.log('Changed state to: ');
    console.log(toState);
    console.log('auth required: ' + toState.authRequired);
    // console.log('LoginService.isAuthenticated(): ' + LoginService.isAuthenticated());
    console.log('RegisterService.isRegisteredSuccessful(): ' + RegisterService.isRegisteredSuccessful())
    console.log($rootScope.currentUser);
    console.log('---------------------------------------');

    
    if ($rootScope.currentUser.isCurrentlyActive && toState.name != 'home') {
      // выход из рекурсии
      // if (toState.name == 'home') return;
      console.log('jailing active user');
      event.preventDefault();
      $state.transitionTo('home');
    } else if (toState.authRequired && !$rootScope.currentUser.isCurrentlyActive) {
      // Remember toState and toStateParams.
      // $rootScope.toStateName = toState.name;
      // Abort transition
      event.preventDefault();
      // Redirect to login page
      $state.transitionTo('login');
    } 
    // else if (RegisterService.isRegisteredSuccessful() && fromState.name == 'register') {
    //   console.log('here 3rd if');
    //   event.preventDefault();
    //   $state.transitionTo('home');
    // }
  });
});
