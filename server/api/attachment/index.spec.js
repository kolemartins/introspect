'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var attachmentCtrlStub = {
  index: 'attachmentCtrl.index',
  show: 'attachmentCtrl.show',
  create: 'attachmentCtrl.create',
  update: 'attachmentCtrl.update',
  destroy: 'attachmentCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var attachmentIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './attachment.controller': attachmentCtrlStub
});

describe('Attachment API Router:', function() {

  it('should return an express router instance', function() {
    attachmentIndex.should.equal(routerStub);
  });

  describe('GET /api/attachments', function() {

    it('should route to attachment.controller.index', function() {
      routerStub.get
        .withArgs('/', 'attachmentCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/attachments/:id', function() {

    it('should route to attachment.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'attachmentCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/attachments', function() {

    it('should route to attachment.controller.create', function() {
      routerStub.post
        .withArgs('/', 'attachmentCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/attachments/:id', function() {

    it('should route to attachment.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'attachmentCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/attachments/:id', function() {

    it('should route to attachment.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'attachmentCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/attachments/:id', function() {

    it('should route to attachment.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'attachmentCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
