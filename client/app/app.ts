'use strict';

angular.module('introspectApp', [
  'introspectApp.auth',
  'introspectApp.admin',
  'introspectApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'validation.match',
  'ui.grid',
  'ui.grid.selection',
  'ui.grid.resizeColumns',
  'hm.readmore',
  'ngAnimate',
  'ngFileUpload',
  'duScroll'
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/login');

    $locationProvider.html5Mode(true);
  });
