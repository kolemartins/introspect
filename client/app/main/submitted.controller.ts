'use strict';

class SubmittedController {
  constructor(Auth, $state) {
    this.user = {};
    this.errors = {};
    this.submitted = false;

    this.Auth = Auth;
    this.$state = $state;
    //console.log("inside submitted controller constructor");
  }

  exit(){
    this.Auth.logout();
    this.$state.go('login');
  }

  changeState(state){
    this.$state.go(state);
  }
}

angular.module('introspectApp')
  .controller('SubmittedController', SubmittedController);
