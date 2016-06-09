'use strict';
(function(){

class InquiryDetailComponent {

  constructor($state, $filter, Modal, InquiryResource, $stateParams) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$filter = $filter;
    this.textLimit = 400;
    this.Modal = Modal;
    this.inquiry = {};

    var inquiryPromise = InquiryResource.inquiry.get({ id: this.$stateParams.id });
    inquiryPromise.$promise.then((response) => {
        //console.log("inquiry lookup async response --> " + JSON.stringify(response));
        this.inquiry = response;
      })
      .catch(err => {
        this.error = err.message;
      });

  }

  hide(){
    //console.log('In hide');
    this.$state.go('inquiry');
  }

  respond(inquiry){
    this.$state.go('response',{ inquiryId: inquiry._id });
  }
  // this is copy paste duplicated code from inquiry.controller - need to create a better modal arch to share common functions
  ack(inquiry){
    var modal = {
      id: inquiry._id,  // this should not have to be filtered, need to determine how to get parsed json
      subject: inquiry.subject,
      dismissable: true,
      title: 'Confirm Acknowledgement',
      templateUrl: 'app/inquiry/inquiryModal.html',
      text: 'Are you sure you want to confirm this inquiry?',
      buttons: [{
        classes: 'btn-warning',
        text: 'Acknowledge',
        id: 'ACK'
      },{
        classes: 'btn-default',
        text: 'Cancel',
        id: 'OK'
      },]
    }
    var modal = this.Modal.open(modal,'modal-warning','md'); // make modal size dynamic on screen size
    modal.result.then(function(event) {
      //console.log('event: ' + event.type);
    });
  }

  close(inquiry){
    var modal = {
      id: (inquiry._id),
      subject: (inquiry.subject),
      dismissable: true,
      title: 'Close Inquiry',
      html: 'Are you sure you want to close this inquiry? \
            <br>A notification will be sent to the initiator or the inquiry.<br><br>',
      templateUrl: 'app/inquiry/inquiryModal.html',
      buttons: [{
        classes: 'btn-danger',
        text: 'Close',
        id: 'CLS'
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
  }
}

angular.module('introspectApp')
  .controller('InquiryDetailController', InquiryDetailComponent)
  .filter('convert', function() {  // filter is used because it seems the inquiry is being passed as a string rather than object
    return function(input,type) {
      //console.log('input: ' + input);
      //console.log('type: ' + type);
      if(input){
        var json = JSON.parse(input);
        return json[type] || '';
      } else {
        return null;
      }

  };
});

})();
