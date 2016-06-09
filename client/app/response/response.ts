'use strict';

angular.module('introspectApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('response', {
        url: '/response/:inquiryId',
        templateUrl: 'app/response/response.html',
        controller: 'ResponseController',
        controllerAs: 'vm'
      })
      .state('response.detail', {
        url: '/list',
        templateUrl: 'app/response/responseList.html',
        controller: 'ResponseListController',
        controllerAs: 'vm'
      });
  });
