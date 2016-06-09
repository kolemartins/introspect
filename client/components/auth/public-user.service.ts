'use strict';

(function() {

  function PublicUserResource($resource) {
    return {
      confirm: $resource('/api/users/confirm'),
      genCode: $resource('/api/users/genCode')
    }
  }

  angular.module('introspectApp.auth')
    .factory('PublicUser', PublicUserResource);

})();
