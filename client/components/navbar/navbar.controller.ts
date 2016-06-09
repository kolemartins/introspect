'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
    'title': 'Create',
    'state': 'main'
  },{
    'title': 'List',
    'state': 'inquiry'
  }];

  isCollapsed = true;
  //end-non-standard

  constructor(Auth) {
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
  }
}

angular.module('introspectApp')
  .controller('NavbarController', NavbarController);
