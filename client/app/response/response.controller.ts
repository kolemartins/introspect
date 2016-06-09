'use strict';
(function(){

class ResponseController {

  constructor($stateParams, InquiryResource, NoteResource, Auth, $state, $scope, Modal) {

    this.inquiryId = $stateParams.inquiryId;
    this.$state = $state;
    this.$scope = $scope;
    this.Modal = Modal;
    this.textLimit = 800;
    this.inquiry = {};
    this.NoteResource = NoteResource;
    this.InquiryResource = InquiryResource;
    this.Auth = Auth;
    this.errors = {};
    this.notes = [];

    var newInquiry = this.InquiryResource.inquiry.get({ id: this.inquiryId });
    newInquiry.$promise.then((response) => {
      this.inquiry = response;
    })
    .catch(err => {
      this.errors.other = err.message;
    });

    // get notes for message count on badge
    var noteResource = this.NoteResource.noteByInquiry.query({ id: this.inquiryId });
    noteResource.$promise.then((response) => {
        this.notes = response;
        //console.log("notes returned: " + JSON.stringify(this.notes) + 'length ' + this.notes.length);
      })
      .catch(err => {
        this.errors.other = err.message;
      });
  }

  updateEscalation(){
    var inq = this.InquiryResource.inquiry.replace(this.inquiry);
    inq.$promise.then((resp) => {
        //console.log('RESPONSE: ' + resp);
      })
      .catch(err => {
        this.errors.other = err.data;
        console.log('ERR: ' + err.status + ' --> ' + err.data.errmsg + " | " + err.data);
      });
  }

  respond(respType){
    //console.log('processing urgent inquiry --> ' + respType);
    //if a note was not provided, do nothing
    if(!this.note){
      return;
    }

    // launch modal if type = 'URGENT' indicating cell message will be sent
    if(respType === 'URGENT'){
      //console.log('processing urgent response');
      var modal = {
        id: this.inquiry._id,
        subject: this.inquiry.subject,
        note: this.note,
        dismissable: true,
        title: 'Send Urgent Response',
        html: 'Urgent inquiries will trigger a text or voice call to the responding party. \
              <br>Do you wish to proceed?<br><br>',
        templateUrl: 'components/modal/modal.html',
        buttons: [{
          classes: 'btn-danger',
          text: 'Ok',
          id: 'URGENT'
        }, {
          classes: 'btn-default',
          text: 'Cancel',
          id: 'OK'
        }]
      }

      var modal = this.Modal.open(modal,'modal-danger','md');
      modal.result.then(function(event) {
        //console.log('event: ' + event.type);
      });
    } else {
      //console.log('inside respond.  respType --> ' + respType);
      var currentUser = this.Auth.getCurrentUser().email;
      var noteObj = {
        inquiryId: this.inquiryId,
        type: respType,
        note: this.note,
        urgent: false,
        createdBy: currentUser,
        createdDate: new Date()
      };
      var noteResource = this.NoteResource.note.save(noteObj);
      noteResource.$promise.then(() => {
        // can't get callback to work????
      });
      //update the inquiry to a 'RESPONDED' or 'CLOSED' status depending on response button clicked
      //console.log('new note created.  Updating status of [' + this.inquiryId + '] with this response type [' + respType + ']');
      var ir = this.InquiryResource.inquiryStatus.get({
        id: this.inquiryId,
        status: respType === 'RESP_CLOSE' ? 'CLS' : 'RSP',
        who: currentUser
      }, function(resp){
        //console.log('RESPONSE: ' + JSON.stringify(resp));
      });
      this.$state.go('inquiry.detail', { id: this.inquiryId });
    }
  }

  launchFileUpload(inquiryId){
    //console.log('launching file upload for inquiry: ' + inquiryId);
    this.InquiryResource.launchFileUpload(inquiryId);
  }
}

angular.module('introspectApp')
  .controller('ResponseController', ResponseController);
})();
