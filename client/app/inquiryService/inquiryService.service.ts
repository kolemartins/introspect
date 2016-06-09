'use strict';

(function() {

  function InquiryResource($resource, Modal) {
    return {
      inquiry: $resource('/api/inquiries/:id', { id: '@_id' }, {
        replace: {
          method: 'PUT'
        }
      }),
      inquiryStatus: $resource('/api/inquiries/:id/status/:status/:who'),  // no data required to be posted
      launchFileUpload: (inquiryId) => {
        //console.log('launchFileUpload - inquiryId: ' + inquiryId);
        var modal = {
          id: inquiryId,
          dismissable: true,
          title: 'Upload Files',
          html: 'Please choose the files to upload.',
          templateUrl: 'app/main/uploadModal.html',
          buttons: [{
            classes: 'btn-info',
            text: 'Close',
            id: 'OK'
          }]
        }
        var modal = Modal.open(modal,'modal-info','md');
        modal.result.then(function(event) {
          //console.log('event: ' + event.type);
        });
      }
    }
  }

  angular.module('introspectApp')
    .factory('InquiryResource', InquiryResource);

})();
