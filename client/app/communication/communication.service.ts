'use strict';

angular.module('introspectApp')
  .service('communication', function () {
    return {
      getContactInfo: (inquiry) => {
        var topic = inquiry.topic;
        var person = inquiry.person;
      }
    }
  });
