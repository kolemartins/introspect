'use strict';

describe('Service: inquiryService', function () {

  // load the service's module
  beforeEach(module('introspectApp.inquiryService'));

  // instantiate service
  var inquiryService;
  beforeEach(inject(function (_inquiryService_) {
    inquiryService = _inquiryService_;
  }));

  it('should do something', function () {
    expect(!!inquiryService).toBe(true);
  });

});
