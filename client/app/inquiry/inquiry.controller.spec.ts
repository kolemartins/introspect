'use strict';

describe('Component: InquiryComponent', function () {

  // load the controller's module
  beforeEach(module('introspectApp'));

  var InquiryComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    InquiryComponent = $componentController('InquiryComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
