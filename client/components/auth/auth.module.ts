'use strict';

angular.module('introspectApp.auth', [
  'introspectApp.constants',
  'introspectApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
