'use strict';

(function() {

  function AttachmentResource($resource) {
    return {
      note: $resource('/api/attachments/:id', { id: '@_id' }, {
        'save':   {method:'POST'},
        'update' : { method: 'PUT'}
      }),
      attachmentsByInquiry: $resource('/api/attachments/inquiry/:id')
    }
  }

  angular.module('introspectApp')
    .factory('AttachmentResource', AttachmentResource);

})();
