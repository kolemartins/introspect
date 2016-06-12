/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/notes              ->  index
 * POST    /api/notes              ->  create
 * GET     /api/notes/:id          ->  show
 * PUT     /api/notes/:id          ->  update
 * DELETE  /api/notes/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import config from '../../config/environment';
import Note from './note.model';
import Inquiry from '../inquiry/inquiry.model';
import Communications from '../../util/communications'
const util = require('util');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
      // trying to suppress: Warning: a promise was created in a handler but was not returned from it
      return entity;
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Notes
export function index(req, res) {
  return Note.find().sort('-createdDate').exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Note from the DB
export function show(req, res) {
  return Note.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Fetches Notes for a single Inquiry ID from the DB
export function getByInquiry(req, res) {
  return Note.find({ inquiryId: req.params.id }).sort('-createdDate').exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Note in the DB
export function create(req, res) {
  //console.log("CREATE: " + JSON.stringify(req.body));
  return Note.create(req.body)
    .then(notify(req, res))
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// sends email & text messages for urgent responses
function notify(req, res){
  var commType = req.body.sendNotifVia;
  console.log('In notify method.  Sending message via --> ' + commType);
  return function(entity) {
    console.log('notify entity --> ' + entity);
    var commMod = new Communications();
    // if URGENT, send text message
    if (entity && entity.urgent) {
      // send text
      if(commType === 'text'){
        console.log('sending text...');
        var msg = {
          to: config.twilio.defaultDestination,
          from: config.twilio.twilioPhone,
          body: 'URGENT: An urgent response has been directed to you.',
          url: config.email.emailLinkHost + '/response/' + entity.inquiryId + '/list'
        };
        commMod.sendText(msg);
      }

      // send voice
      if(commType === 'voice'){
        var msg = {
          to: config.twilio.defaultDestination,
          from: config.twilio.twilioPhone,
          url: config.email.emailLinkHost + '/api/notification/voice-message/response/' + entity._id,
          method: 'GET',
          fallbackMethod: 'GET',
          statusCallbackMethod: 'GET',
          record: false
        };
        commMod.sendVoice(msg);
      }

    }
    // send email for all additions to the notes collection

    // retrieve the subject of the inquiry related to this note for reference in the email
    Inquiry.findById(entity.inquiryId).exec()
      .then(function(res){
        console.log("RES ---> " + util.inspect(res));
        var destination = 'michael.stanley@gmail.com';
        var mailOptions = {
          to: destination,
          subject: (entity.urgent ? 'URGENT: ' : '') + 'Inquiry Response Received',
          data: entity,
          inquiryId: entity.inquiryId,
          url: config.email.emailLinkHost + '/response/' + entity.inquiryId + '/list',
          type: entity.urgent ? 'UrgentResponse' : 'Response',
          inquirySubject: res.subject
        };
        // send mail with defined transport object
        commMod.sendEmail(mailOptions);
        return res;
      });
    return entity; // returns before email is actually sent since email is done async
  };
}

// Updates an existing Note in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Note.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Note from the DB
export function destroy(req, res) {
  return Note.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
