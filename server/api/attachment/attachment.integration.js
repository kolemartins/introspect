'use strict';

var app = require('../..');
import request from 'supertest';

var newAttachment;

describe('Attachment API:', function() {

  describe('GET /api/attachments', function() {
    var attachments;

    beforeEach(function(done) {
      request(app)
        .get('/api/attachments')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          attachments = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      attachments.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/attachments', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/attachments')
        .send({
          name: 'New Attachment',
          info: 'This is the brand new attachment!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newAttachment = res.body;
          done();
        });
    });

    it('should respond with the newly created attachment', function() {
      newAttachment.name.should.equal('New Attachment');
      newAttachment.info.should.equal('This is the brand new attachment!!!');
    });

  });

  describe('GET /api/attachments/:id', function() {
    var attachment;

    beforeEach(function(done) {
      request(app)
        .get('/api/attachments/' + newAttachment._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          attachment = res.body;
          done();
        });
    });

    afterEach(function() {
      attachment = {};
    });

    it('should respond with the requested attachment', function() {
      attachment.name.should.equal('New Attachment');
      attachment.info.should.equal('This is the brand new attachment!!!');
    });

  });

  describe('PUT /api/attachments/:id', function() {
    var updatedAttachment;

    beforeEach(function(done) {
      request(app)
        .put('/api/attachments/' + newAttachment._id)
        .send({
          name: 'Updated Attachment',
          info: 'This is the updated attachment!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedAttachment = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedAttachment = {};
    });

    it('should respond with the updated attachment', function() {
      updatedAttachment.name.should.equal('Updated Attachment');
      updatedAttachment.info.should.equal('This is the updated attachment!!!');
    });

  });

  describe('DELETE /api/attachments/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/attachments/' + newAttachment._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when attachment does not exist', function(done) {
      request(app)
        .delete('/api/attachments/' + newAttachment._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
