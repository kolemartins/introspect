'use strict';

var app = require('../..');
import request from 'supertest';

var newNote;

describe('Note API:', function() {

  describe('GET /api/notes', function() {
    var notes;

    beforeEach(function(done) {
      request(app)
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          notes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      notes.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/notes', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/notes')
        .send({
          name: 'New Note',
          info: 'This is the brand new note!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newNote = res.body;
          done();
        });
    });

    it('should respond with the newly created note', function() {
      newNote.name.should.equal('New Note');
      newNote.info.should.equal('This is the brand new note!!!');
    });

  });

  describe('GET /api/notes/:id', function() {
    var note;

    beforeEach(function(done) {
      request(app)
        .get('/api/notes/' + newNote._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          note = res.body;
          done();
        });
    });

    afterEach(function() {
      note = {};
    });

    it('should respond with the requested note', function() {
      note.name.should.equal('New Note');
      note.info.should.equal('This is the brand new note!!!');
    });

  });

  describe('PUT /api/notes/:id', function() {
    var updatedNote;

    beforeEach(function(done) {
      request(app)
        .put('/api/notes/' + newNote._id)
        .send({
          name: 'Updated Note',
          info: 'This is the updated note!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedNote = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedNote = {};
    });

    it('should respond with the updated note', function() {
      updatedNote.name.should.equal('Updated Note');
      updatedNote.info.should.equal('This is the updated note!!!');
    });

  });

  describe('DELETE /api/notes/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/notes/' + newNote._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when note does not exist', function(done) {
      request(app)
        .delete('/api/notes/' + newNote._id)
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
