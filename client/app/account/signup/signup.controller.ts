'use strict';

class SignupController {
  //start-non-standard
  user = {};
  errors = {};
  submitted = false;
  codeSubmitted = false;
  codeMatch = false;
  //end-non-standard

  constructor(Auth, $state, PublicUser) {
    this.Auth = Auth;
    this.PublicUser = PublicUser;
    this.$state = $state;
    this.awaitConfirmCode = false;
  }

  register(form) {
    this.submitted = true;
    //console.log('inside register new user');
    if (form.$valid) {
      this.Auth.createUser({
        fname: this.user.fname,
        lname: this.user.lname,
        email: this.user.email,
        cell:  this.user.cell,
        password: this.user.password
      })
      .then(() => {
        //this.$state.go('main');
        this.awaitConfirmCode = true;
      })
      .catch(err => {
        err = err.data;
        this.errors = {};

        // Update validity of form fields that match the mongoose errors
        angular.forEach(err.errors, (error, field) => {
          form[field].$setValidity('mongoose', false);
          this.errors[field] = error.message;
        });
      });
    }
  }

  confirmCode(){
    this.codeSubmitted = true;
    this.PublicUser.confirm.save({
      email: this.user.email,
      code: this.code
    }).$promise.then(
      (value) => {
        //console.log('in success: ' + JSON.stringify(value));
        this.codeMatch = true;
        this.$state.go('login');
      },
      (error) => {
        //console.log('in error: ' + JSON.stringify(error));
        this.codeMatch = false;
      }
    )
  }

  genConfirmCode(){
    //console.log("USER --> " + JSON.stringify(this.user));
    this.PublicUser.genCode.save({
      email: this.user.email
    });
  }
}

angular.module('introspectApp')
  .controller('SignupController', SignupController);
