'use strict';
(function(){

  class ResponseListController {
    constructor($stateParams, NoteResource, $filter, $http) {
      //console.log("ResponseListController constructor");
      this.errors = {};
      this.$filter = $filter;
      this.NoteResource = NoteResource;
      this.errors = {}
      this.noteList = [];
      this.inquiryId = $stateParams.inquiryId;
      this.textLimit = 1000;
      this.showResult = false;
      var responseList = this.NoteResource.noteByInquiry.query({ id: this.inquiryId });
      responseList.$promise.then((response) => {
        //console.log("response list async response --> " + JSON.stringify(response));
        this.showResult = true;
        this.noteList = response;
        })
        .catch(err => {
          this.errors.other = err.message;
        });
    }
  }

  angular.module('introspectApp')
    .filter("nl2br",  function($sce) {
      return function(data) {
        if (!data) return data;
        return $sce.trustAsHtml(data.replace(/\n\r?/g, '<br />'));
      };
    })
    .controller('ResponseListController', ResponseListController);
})();
