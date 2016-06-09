'use strict';

(function() {

  function Topic($resource) {
    return {
      topic: $resource('/api/topics/:id', { id: '@_id' }, {
        replace: {
          method: 'PUT'
        }
      })
    }
  }

  angular.module('introspectApp')
    .factory('Topic', Topic);

})();
