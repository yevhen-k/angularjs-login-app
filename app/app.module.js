'use strict';

// Define the `phonecatApp` module
angular.module('loginApp', [
  'LocalStorageModule',
  'ui.router',
  'ui.router.state.events',
  'login',
  'register',
  'home'
]);
