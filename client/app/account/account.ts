'use strict';

angular.module('introspectApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginController',
        controllerAs: 'vm'
      })
      .state('logout', {
        url: '/logout?referrer',
        referrer: 'main',
        template: '',
        controller: function($state, Auth) {
          //console.log("$state.params.referrer: " + $state.params.referrer);
          //console.log("$state.current.referrer: " + $state.current.referrer);
          //var referrer = $state.params.referrer ||
          //                $state.current.referrer ||
          //                'main';
          Auth.logout();
          var referrer = 'login';
          $state.go(referrer);
        }
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupController',
        controllerAs: 'vm'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsController',
        controllerAs: 'vm',
        authenticate: true
      });
  })
  .run(function($rootScope,$state,Auth) {
    $rootScope.$on('$stateChangeStart', function(event, next, nextParams, current) {
      //console.log("next: " + JSON.stringify(next));
      //console.log("current: " + JSON.stringify(current));
      //if(current && current.name && !current.authenticate && !AuthService.user){
        //event.preventDefault();
        //$state.go('login');
      //}
      if(!Auth.isLoggedIn() && next.authenticate){
        event.preventDefault();
        //console.log("transition to login");
        $state.go('login');
      }
      if (next.name === 'logout' && current && current.name && !current.authenticate) {
        next.referrer = current.name;
      }

    });
  });
