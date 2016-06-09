'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var noteCtrlStub = {
  index: 'noteCtrl.index',
  show: 'noteCtrl.show',
  create: 'noteCtrl.create',
  update: 'noteCtrl.update',
  destroy: 'noteCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var noteIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './note.controller': noteCtrlStub
});

describe('Note API Router:', function() {

  it('should return an express router instance', function() {
    noteIndex.should.equal(routerStub);
  });

  describe('GET /api/notes', function() {

    it('should route to note.controller.index', function() {
      routerStub.get
        .withArgs('/', 'noteCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/notes/:id', function() {

    it('should route to note.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'noteCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/notes', function() {

    it('should route to note.controller.create', function() {
      routerStub.post
        .withArgs('/', 'noteCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/notes/:id', function() {

    it('should route to note.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'noteCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/notes/:id', function() {

    it('should route to note.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'noteCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/notes/:id', function() {

    it('should route to note.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'noteCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
