'use strict';
(function(){

class InquiryDashboardController {

  constructor($stateParams, InquiryResource, AttachmentResource, NoteResource) {
    this.error = '';
    this.$stateParams = $stateParams;
    this.inquiryId = this.$stateParams.id;
    this.InquiryResource = InquiryResource;
    this.AttachmentResource = AttachmentResource;
    this.NoteResource = NoteResource;
    this.isCollapsed = 'true'; // trying the bootstrap nav for page functions
    this.notFoundMessage = '';

    var inquiryPromise = InquiryResource.inquiry.get({ id: this.inquiryId });
    inquiryPromise.$promise.then((response) => {
        console.log("inquiry lookup async response --> " + JSON.stringify(response));
        this.inquiry = response;
        return response;
      }, (error) => {
        console.log('An error occurred while looking up inquiry --> ' + JSON.stringify(error));
        this.notFoundMessage = 'Inquiry not found. Inquiry ID ' + this.inquiryId + ' does not exist.'
      }).then(() => {
        var attachmentResource = AttachmentResource.attachmentsByInquiry.query({ id: this.inquiryId });
        attachmentResource.$promise.then((response) => {
          console.log("Attachments --> " + JSON.stringify(response));
          this.attachments = response;
        }).then(() => {
          var noteResource = NoteResource.noteByInquiry.query({ id: this.inquiryId });
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
