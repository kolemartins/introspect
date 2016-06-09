'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var inquiryCtrlStub = {
  index: 'inquiryCtrl.index',
  show: 'inquiryCtrl.show',
  create: 'inquiryCtrl.create',
  update: 'inquiryCtrl.update',
  destroy: 'inquiryCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var inquiryIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './inquiry.controller': inquiryCtrlStub
});

describe('Inquiry API Router:', function() {

  it('should return an express router instance', function() {
    inquiryIndex.should.equal(routerStub);
  });

  describe('GET /api/inquiries', function() {

    it('should route to inquiry.controller.index', function() {
      routerStub.get
        .withArgs('/', 'inquiryCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/inquiries/:id', function() {

    it('should route to inquiry.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'inquiryCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/inquiries', function() {

    it('should route to inquiry.controller.create', function() {
      routerStub.post
        .withArgs('/', 'inquiryCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/inquiries/:id', function() {

    it('should route to inquiry.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'inquiryCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/inquiries/:id', function() {

    it('should route to inquiry.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'inquiryCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/inquiries/:id', function() {

    it('should route to inquiry.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'inquiryCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
