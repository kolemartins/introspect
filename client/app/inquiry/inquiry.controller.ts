'use strict';
(function(){

class InquiryComponent {

  selectedInquiry = {};

  constructor(InquiryResource, Modal, $scope, uiGridConstants, $state) {
    this.showDetail = 'false';
    this.uiGridConstants = uiGridConstants;
    this.InquiryResource = InquiryResource;
    this.Modal = Modal;
    this.$scope = $scope;
    this.$state = $state;
    // retrieve all inquiries and put on scope
    this.inquiries = InquiryResource.inquiry.query();
    var rowtpl = '<div ng-class="{\'row-urgent\':true, \'blue\':row.entity.priority==4 }"><div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'urgent\':row.entity.priority==4 && col.colDef.name == \'subject\',  \'asap\':row.entity.priority==3 && col.colDef.name == \'subject\', \'soon\':row.entity.priority==2 && col.colDef.name == \'subject\', \'whenever\':row.entity.priority==1 && col.colDef.name == \'subject\'}" ui-grid-cell></div></div>';
    // define grid for list
    this.colDefsLargeScreen = {};
    this.colDefsLargeScreen.columnDefs = [
      { name:'topic', field: 'topic', visible: false },
      { name:'person', field: 'person', visible: false },
      { name:'subject', field: 'subject', cellTemplate: '<div class="ui-grid-cell-contents btn btn-block  cell-subject" ui-sref="inquiry-dashboard({ id: row.entity._id })">{{row.entity[col.field]}}</div>' },
      { name: 'priority', field: 'priority', visible: false, width: 70, cellTemplate: '<div style="margin: 3px 0px 3px 6px"><span class="label label-danger" ng-show="row.entity.priority == 4">URGENT</span><span class="label label-primary" ng-show="row.entity.priority == 3">&nbsp;&nbsp;&nbsp;&nbsp;ASAP&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="label label-warning" ng-show="row.entity.priority == 2">&nbsp;&nbsp;&nbsp;SOON&nbsp;&nbsp;&nbsp;</span><span class="label label-info" ng-show="row.entity.priority == 1">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LOW&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div>'},
      { name:'message', field: 'message', visible: false},
      { name:'requestedBy', field: 'requestedBy', width: 120, visible: true},
      { name:'requestDate', width: 120, field: 'requestDate', cellFilter: 'date:"MMM dd, HH:mm:ss"', visible: true},
      {
        name:'Action',
        width: 130,
        cellTemplate: "<div> \
                        <button class='btn btn-default btn-sm btn-icon' ng-show='row.entity.status === \"OPEN\"'><span class='glyphicon glyphicon-ok' ng-click='grid.appScope.ack(row)'/></button> \
                        <button class='btn btn-default btn-sm btn-icon'><span class='glyphicon glyphicon-share-alt' ng-click='grid.appScope.respond(row)'/></button> \
                        <button class='btn btn-default btn-sm btn-icon' ng-show='row.entity.status !== \"CLOSED\"'><span class='glyphicon glyphicon-remove' ng-click='grid.appScope.close(row)'/></button> \
                        </div>"

      }
    ];

    this.colDefsSmallScreen = {};
    this.colDefsSmallScreen.columnDefs = [
      { name:'topic', field: 'topic', visible: false },
      { name:'person', field: 'person', visible: false },
      { name:'subject', field: 'subject', cellTemplate: '<div class="ui-grid-cell-contents btn btn-block  cell-subject" ui-sref="inquiry-dashboard({ id: row.entity._id })">{{row.entity[col.field]}}</div>' },
      { name: 'priority', field: 'priority', visible: false, width: 70, cellTemplate: '<div style="margin: 3px 0px 3px 6px"><span class="label label-danger" ng-show="row.entity.priority == 4">URGENT</span><span class="label label-primary" ng-show="row.entity.priority == 3">&nbsp;&nbsp;&nbsp;&nbsp;ASAP&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="label label-warning" ng-show="row.entity.priority == 2">&nbsp;&nbsp;&nbsp;SOON&nbsp;&nbsp;&nbsp;</span><span class="label label-info" ng-show="row.entity.priority == 1">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LOW&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div>'},
      { name:'message', field: 'message', visible: false},
      { name:'requestDate', field: 'requestDate', visible: false, width: 120, cellFilter: 'date:"MMM dd, HH:mm:ss"'},
      {
        name:'Action',
        width: 130,
        cellTemplate: "<div> \
                        <button class='btn btn-default btn-sm btn-icon' ng-show='row.entity.status === \"OPEN\"'><span class='glyphicon glyphicon-ok' ng-click='grid.appScope.ack(row)'/></button> \
                        <button class='btn btn-default btn-sm btn-icon'><span class='glyphicon glyphicon-share-alt' ng-click='grid.appScope.respond(row)'/></button> \
                        <button class='btn btn-default btn-sm btn-icon' ng-show='row.entity.status !== \"CLOSED\"'><span class='glyphicon glyphicon-remove' ng-click='grid.appScope.close(row)'/></button> \
                        </div>"

      }
    ];
    // common grid options
    this.gridOptions = {
      rowTemplate: rowtpl,
      enableColumnResizing: true,
      enableGridMenu: true,
      enableSorting: true,
      enableRowSelection: true,
      enableFullRowSelection: false,
      enableHeaderRowSelection: false,
      selectionRowHeaderWidth: 35,
      rowHeight: 30,
      showGridFooter: false,
      // removing column defs to specializa for small / large screen
      appScopeProvider:  this,  // provides buttons access to scope
      data : this.inquiries
    };
    //
    this.gridOptions.multiSelect = false;
    this.gridOptions.modifierKeysToMultiSelect = false;
    this.gridOptions.noUnselect = true;
    this.gridOptions.enableFiltering = true;
    this.gridOptions.onRegisterApi = function(gridApi){
      this.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        //console.log('gridApi.grid.appScope.showDetail=' + JSON.stringify(row.entity));
        gridApi.grid.appScope.selectedInquiry = row.entity;
        gridApi.grid.appScope.$state.go('inquiry.detail',{ id: row.entity._id });
      });
    };
    // create the grid configs for small and large screens from the common grid options and the screen size specific column definitions
    this.gridOptionsSmall = _.merge(_.clone(this.gridOptions),this.colDefsSmallScreen);
    this.gridOptionsLarge = _.merge(_.clone(this.gridOptions), this.colDefsLargeScreen);
  }

  // button action: launch 'acknowledge an inquiry' modal
  ack(row){
    //console.log('ACK row --> ' + JSON.stringify(row.entity));
    var modal = {
      id: row.entity._id,
      subject: row.entity.subject,
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
  // button action: launch 'respond to an inquiry' state
  respond(row){
    var modal = {
      id: row.entity._id,
      subject: row.entity.subject,
      dismissable: true,
      title: 'Respond',
      text: 'Are you sure you want to respond to this inquiry?',
      templateUrl: 'app/inquiry/inquiryModal.html',
      buttons: [{
        classes: 'btn-danger',
        text: 'Urgent',
        id: 'URG_RSP'
      }, {
        classes: 'btn-warning',
        text: 'Respond / Close',
        id: 'CLOSED'
      }, {
        classes: 'btn-info',
        text: 'Respond',
        id: 'COMMUNICATING'
      },
      {
        classes: 'btn-default',
        text: 'Cancel',
        id: 'OK'
      }]
    }

    /**  using a new route to a view rather than a modal
    var modal = this.Modal.open(modal, 'modal-info','md');
    modal.result.then(function(event) {
      //console.log('event: ' + event.type);
    });
    **/
    //console.log('_id --> ' + row.entity._id);
    this.$state.go('response', { inquiryId: row.entity._id });
  }
  // button action: launch 'close an inquiry' modal
  close(row){
    var modal = {
      id: row.entity._id,
      subject: row.entity.subject,
      dismissable: true,
      title: 'Close Inquiry',
      html: 'Are you sure you want to close this inquiry? \
            <br>A notification will be sent to the initiator or the inquiry.<br><br>',
      templateUrl: 'app/inquiry/inquiryModal.html',
      buttons: [{
        classes: 'btn-danger',
        text: 'Close',
        id: 'CLOSED'
      }, {
        classes: 'btn-default',
        text: 'Cancel',
        id: 'OK'
      }]
    }

    var modal = this.Modal.open(modal,'modal-danger','md');
    modal.result.then(function(event) {
      if(event === 'CLOSED') {
        console.log('event: ' + JSON.stringify(event));
      }
    }, function(){
      console.log('Modal dismissed at: ' + new Date());
    });
  }

}

angular.module('introspectApp')
  .component('inquiry', {
    templateUrl: 'app/inquiry/inquiry.html',
    controller: InquiryComponent,
    controllerAs: 'vm'
  });

})();
