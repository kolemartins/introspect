'use strict';

(function() {

  function NoteResource($resource) {
    return {
      note: $resource('/api/notes/:id', { id: '@_id' }, {
        'save':   {method:'POST'},
        'update' : { method: 'PUT'}
      }),
      noteByInquiry: $resource('/api/notes/inquiry/:id')
    }
  }

  angular.module('introspectApp')
    .factory('NoteResource', NoteResource);

})();
