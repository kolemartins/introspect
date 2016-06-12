'use strict';
angular.module('introspectApp')
  .factory('Modal', function($rootScope,$uibModal) {
    return {
      open: function(scope = {}, modalClass = 'modal-default', size = 'sm') {
        //console.log('scope: ' + JSON.stringify(scope));
        var modalScope = $rootScope.$new();
        modalScope.modal = scope;
        console.log('Using modal template --> ' + modalScope.modal.templateUrl);
        return $uibModal.open({
          animation: true,
          templateUrl: modalScope.modal.templateUrl || 'components/modal/modal.html',
          controller: 'ModalInstanceCtrl',
          scope: modalScope,
          windowClass: modalClass,
          size: size
        });
      }
    };
  });
