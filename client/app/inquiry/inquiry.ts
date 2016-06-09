'use strict';

angular.module('introspectApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('inquiry', {
        url: '/inquiry',
        template: '<inquiry></inquiry>',
        authenticate: false
      })
      .state('inquiry.detail', {
        url: '/detail/:id',
        templateUrl: 'app/inquiry-detail/inquiry-detail.html',
        controller: 'InquiryDetailController',
        controllerAs: 'vm',
        authenticate: false
      })
      .state('inquiry-dashboard', {
        url: '/inquiry/:id/dashboard',
        templateUrl: 'app/inquiry-dashboard/inquiry-dashboard.html',
        controller: 'InquiryDashboardController',
        controllerAs: 'vm',
        authenticate: false
      });
  });
