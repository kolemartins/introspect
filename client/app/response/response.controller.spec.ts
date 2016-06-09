'use strict';

describe('Component: ResponseComponent', function () {

  // load the controller's module
  beforeEach(module('introspectApp'));

  var ResponseComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    ResponseComponent = $componentController('ResponseComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
