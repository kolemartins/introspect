'use strict';
(function(){

class InquiryDashboardController {

  constructor($stateParams, InquiryResource, AttachmentResource, NoteResource) {
    this.error = '';
    this.$stateParams = $stateParams;
    this.InquiryResource = InquiryResource;
    this.AttachmentResource = AttachmentResource;
    this.NoteResource = NoteResource;

    var inquiryPromise = InquiryResource.inquiry.get({ id: this.$stateParams.id });
    inquiryPromise.$promise.then((response) => {
        console.log("inquiry lookup async response --> " + JSON.stringify(response));
        this.inquiry = response;
        return response;
      }).then(() => {
        var attachmentResource = AttachmentResource.attachmentsByInquiry.query({ id: this.$stateParams.id });
        attachmentResource.$promise.then((response) => {
          console.log("Attachments --> " + JSON.stringify(response));
          this.attachments = response;
        }).then(() => {
          var noteResource = NoteResource.noteByInquiry.query({ id: this.$stateParams.id });
          noteResource.$promise.then((response) => {
            console.log("Notes --> " + JSON.stringify(response));
            this.noteList = response;
        })
      })
    })
      .catch(err => {
        this.error = err.message;
      });

  }

}

angular.module('introspectApp')
  .controller('InquiryDashboardController', InquiryDashboardController)
})();
