'use strict';

(function() {

class MainController {


  constructor($http, $scope, socket, $state, Auth, InquiryResource, Modal, Topic, User) {
    this.$http = $http;
    this.$state = $state;
    this.Auth = Auth;
    this.socket = socket;
    this.Modal = Modal;
    this.InquiryResource = InquiryResource;
    this.awesomeThings = [];
    this.inquiry = {};
    this.inquiry.topic = "NONE";
    this.inquiry.person = "NONE";
    this.topics = [];
    this.users = [];
    this.errors = {};

    this.topics = Topic.topic.query(() => {
      //console.log('topics returned --> ' + JSON.stringify(this.topics));
    });

    this.users = User.query(() => {
      //console.log('users returned --> ' + JSON.stringify(this.users));
    })

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }

  $onInit() {
    //this.$http.get('/api/things').then(response => {
    //  this.awesomeThings = response.data;
    //  this.socket.syncUpdates('thing', this.awesomeThings);
    //});
  }

  addThing() {
    if (this.newThing) {
      this.$http.post('/api/things', { name: this.newThing });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete('/api/things/' + thing._id);
  }

  saveInquiry(priority){
    //console.log("save inquiry.  priority: " + priority);
    if(priority == 4) {
      var modal = {
        inquiry: this.inquiry,
        dismissable: true,
        templateUrl: 'app/main/urgentInquiryModal.html',
        buttons: [{
          classes: 'btn-danger',
          text: 'Ok',
          id: 'URGENT-INQUIRY'
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
      var currentUser = this.Auth.getCurrentUser().email;
      this.inquiry.priority = priority;
      this.inquiry.status = 'OPEN';
      this.inquiry.requestedBy = currentUser;
      this.inquiry.requestDate = new Date();
      var ir;
      if(this.inquiry._id){
        ir = this.InquiryResource.inquiry.replace(this.inquiry);
      } else {
        ir = this.InquiryResource.inquiry.save(this.inquiry);
      }
      ir.$promise.then((resp) => {
          //console.log('SAVE INQUIRY DATA: ' + JSON.stringify(resp));
          this.$state.go('submitted');
        })
        .catch(err => {
          this.errors = err.data;
          console.log('ERR: ' + err.status + ' --> ' + JSON.stringify(err));
        });
    }
  }

  launchFileUpload(_id){
    // if an ID has not been generated, create a dummy inquiry to associate the file uploads with
    if(!_id){
      var ir = this.InquiryResource.inquiry.save(this.inquiry);
      ir.$promise.then((resp) => {
          //console.log('LAUNCH FILE UPLOAD - CREATE DUMMY INQUIRY DATA: ' + JSON.stringify(resp));
          this.inquiry._id = resp._id;
          this.InquiryResource.launchFileUpload(resp._id);
        })
        .catch(err => {
          this.errors.other = err.data;
          console.log('ERR: ' + err.status + ' --> ' + err.data.errmsg + " | " + err.data);
        });
    } else {
      // launch file upload with ID provided
      this.InquiryResource.launchFileUpload(_id);
    }
  }
}

angular.module('introspectApp')
  .component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController,
    controllerAs: 'vm'
  });

})();
