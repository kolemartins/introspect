'use strict';

angular.module('introspectApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/main',
        template: '<main></main>',
        authenticate: true
      })
      .state('submitted', {
        url: '/submitted',
        templateUrl: 'app/main/submitted.html',
        controller: 'SubmittedController',
        controllerAs: 'vm',
        authenticate: true
      });
  });


