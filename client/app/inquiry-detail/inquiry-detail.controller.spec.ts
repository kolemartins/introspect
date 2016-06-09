'use strict';

describe('Component: InquiryDetailComponent', function () {

  // load the controller's module
  beforeEach(module('introspectApp'));

  var InquiryDetailComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    InquiryDetailComponent = $componentController('InquiryDetailComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
