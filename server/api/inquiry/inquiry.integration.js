'use strict';

var app = require('../..');
import request from 'supertest';

var newInquiry;

describe('Inquiry API:', function() {

  describe('GET /api/inquiries', function() {
    var inquirys;

    beforeEach(function(done) {
      request(app)
        .get('/api/inquiries')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          inquirys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      inquirys.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/inquiries', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/inquiries')
        .send({
          name: 'New Inquiry',
          info: 'This is the brand new inquiry!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newInquiry = res.body;
          done();
        });
    });

    it('should respond with the newly created inquiry', function() {
      newInquiry.name.should.equal('New Inquiry');
      newInquiry.info.should.equal('This is the brand new inquiry!!!');
    });

  });

  describe('GET /api/inquiries/:id', function() {
    var inquiry;

    beforeEach(function(done) {
      request(app)
        .get('/api/inquiries/' + newInquiry._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          inquiry = res.body;
          done();
        });
    });

    afterEach(function() {
      inquiry = {};
    });

    it('should respond with the requested inquiry', function() {
      inquiry.name.should.equal('New Inquiry');
      inquiry.info.should.equal('This is the brand new inquiry!!!');
    });

  });

  describe('PUT /api/inquiries/:id', function() {
    var updatedInquiry;

    beforeEach(function(done) {
      request(app)
        .put('/api/inquiries/' + newInquiry._id)
        .send({
          name: 'Updated Inquiry',
          info: 'This is the updated inquiry!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedInquiry = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedInquiry = {};
    });

    it('should respond with the updated inquiry', function() {
      updatedInquiry.name.should.equal('Updated Inquiry');
      updatedInquiry.info.should.equal('This is the updated inquiry!!!');
    });

  });

  describe('DELETE /api/inquiries/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/inquiries/' + newInquiry._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when inquiry does not exist', function(done) {
      request(app)
        .delete('/api/inquiries/' + newInquiry._id)
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
