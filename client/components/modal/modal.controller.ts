'use strict';
// THIS ENTIRE MODAL ARCHITECTURE NEEDS TO BE REDESIGNED BADLY - VERY CONFUSING AND CONTAINS LOGIC THAT SHOULD NOT EXIST IN THIS CONTROLLER!!!
angular.module('introspectApp')
  .controller('ModalInstanceCtrl', function($scope, $uibModalInstance, Modal, InquiryResource, NoteResource, Auth, Upload, $timeout, appConfig, $state) {
    $scope.log = '';
    $scope.files = [];
    $scope.errors = {};
    $scope.$state = $state;

    $scope.status = {
      CLOSED: 'closed',
      ACK: 'acknowledged',
      OK: 'ok',
      COMMUNICATING: 'responded',
      URGENT: 'submitted as urgent'
    }

    $scope.ok = function() {
      $uibModalInstance.close('ok');
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };

    // update the inquiry status accordingly
    $scope.submit = function(data, actionId, commType){  // commType = 'text' or 'voice'
      commType = commType ? commType : 'text'; // having trouble with radio buttons sending value unless explicitly checked by user; defaulting to text as workaround
      console.log('Send message via --> ' + commType);
      console.log('**************** action: ' + actionId + '****************');
      console.log('data: ' + JSON.stringify(data));

      if(actionId === 'URGENT-INQUIRY'){  // originates from main.jade / main.controller.js
        var currentUser = Auth.getCurrentUser().email;
        data.inquiry.priority = 4;  // highest / urgent priority
        data.inquiry.status = 'OPEN';
        data.inquiry.requestedBy = currentUser;
        data.inquiry.requestDate = new Date();
        data.inquiry.sendNotifVia = commType;  // this is not really an attribute of inquiry but passing it in this object to get the value to the server for sending the notification
        console.log('inquiry being saved --> ' + data.inquiry);
        var ir;
        if(data.inquiry._id){
          ir = InquiryResource.inquiry.replace(data.inquiry);  // inquiry _id was generated when a file upload was performed before the inquiry was submitted
        } else {
          ir = InquiryResource.inquiry.save(data.inquiry);
        }
        ir.$promise.then((resp) => {
            console.log('INQUIRY DATA SAVED: ' + JSON.stringify(resp));
            $scope.$state.go('submitted');
          })
          .catch(err => {
            $scope.errors = err.data;
            console.log('ERR: ' + err.status + ' --> ' + JSON.stringify(err));
          });
      } else if(actionId !== 'OK'){  // OK = close modal and do nothing; all other actions require storing a note; not true any more - urgent inquiries do not require note / only new inquiry
        // set the inquiry status to the action / status chosen
        var currentUser = Auth.getCurrentUser();
        var ir = InquiryResource.inquiryStatus.get({ id: data.id, status: actionId, who: currentUser.email });  // update inquiry status
        ir.$promise.then((resp) => {
            //console.log('INQUIRY STATUS UPDATE RESPONSE: ' + JSON.stringify(resp));
            //store the note
            var noteObj = {
              inquiryId: data.id,
              type: actionId,
              note: data.note ? data.note : 'This inquiry has been ' + $scope.status[actionId] + ' by ' + currentUser.fname + ' ' + currentUser.lname + '.',
              urgent: actionId === 'URGENT' ? true : false,
              createdBy: currentUser.email,
              createdDate: new Date(),
              sendNotifVia: commType  // this is not really an attribute of note but passing it in this object to get the value to the server for sending the notification
            };
            var nr = NoteResource.note.save(noteObj);
            nr.$promise.then((resp) => {
                //console.log('NOTE SAVE RESPONSE: ' + JSON.stringify(resp));
                if(actionId === 'URGENT'){
                  //console.log('urgent response, redirecting to inquiry list');
                  $scope.$state.go('inquiry.detail',{ id: resp.inquiryId });
                }
              })
              .catch(err => {
                this.errors.other = err.data;
                console.log('ERR: ' + err.status + ' --> ' + JSON.stringify(err));
              })

          })
          .catch(err => {
            this.errors.other = err.data;
            console.log('ERR: ' + err.status + ' --> ' + JSON.stringify(err));
          });
      } else {
        // this is just a click of the 'Close' button on the file upload modal - do nothing
      }
      $uibModalInstance.close(actionId);
    }

    // these are file upload functions.  need to find a way to get these out of the general modal code
    $scope.$watch('dropFiles', function () {
      $scope.upload($scope.dropFiles, $scope.modal.id);
    });

    $scope.upload = function (files, inqId) {
      //console.log('in upload method. INQUIRY ID: ' + inqId);
      if (files && files.length) {
        //console.log('files to be processed: ' + files.length);
        for (var i = 0; i < files.length; i++) {
          $scope.files.push(files[i]);
          var file = files[i];
          //console.log('NAME: ' + file.name);
          //console.log('APP CONFIG --> ' + JSON.stringify(appConfig));
          if (!file.$error) {
            Upload.upload({
              //url: 'http://localhost:9000/api/file/upload/' + inqId,
              //url: 'http://www.simplicityjs.com/api/file/upload/' + inqId,
              url: appConfig.fileUploadUrl + inqId,
              data: {
                file: file,
                inquiryId: inqId //empty
              }
            }).then(function (resp) {
              //console.log('Async Response: ' + JSON.stringify(resp.data));
            }, null, function (evt) {
              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name + '\n' + $scope.log);
              //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name + '\n');
              $scope.progressVal = progressPercentage;
            });
          } else {
            console.log('file.$error: ' + file.$error);
          }
        }
      }
    }
  }).filter('humanReadable',function(){
        return function(val){
            return val > 1024 ? Math.round((val / 1000)) + " kb" : val + ' bytes';
        }
  });

