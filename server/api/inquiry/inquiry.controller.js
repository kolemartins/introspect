/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/inquiries              ->  index
 * POST    /api/inquiries              ->  create
 * GET     /api/inquiries/:id          ->  show
 * PUT     /api/inquiries/:id          ->  update
 * DELETE  /api/inquiries/:id          ->  destroy
 */

'use strict';

const util = require('util');
import _ from 'lodash';
import Inquiry from './inquiry.model';
import config from '../../config/environment';

import Communications from '../../util/communications';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
      return entity;
    }
  };
}

function saveUpdates(updates) {
  return function (entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
          return entity;
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
    return null;
  };
}

// Gets a list of Inquirys
export function index(req, res) {
  return Inquiry.find().sort('-requestDate').exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of Inquirys
export function byStatus(req, res) {
  return Inquiry.find({ status: req.params.id }).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Inquiry from the DB
export function show(req, res) {
  return Inquiry.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Inquiry in the DB
export function create(req, res) {
  //debugger;
  //console.log(JSON.stringify(req.body));
  return Inquiry.create(req.body)
    .then(sendUrgentMessage(req, res))
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Inquiry in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Inquiry.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
// sends urgent message
function sendUrgentMessage(req, res) {
  //console.log('in sendUrgentMessage. res: ' + util.inspect(res));
  return function (entity) {
    //console.log('in callback for sendUrgentMessage --> ' + JSON.stringify(entity));
    if (entity) {
      if (entity.priority === '4') {  // this is an urgent request - SEND EMAIL & SMS messages
        //console.log('sending urgent notification. Sending to: ' + config.twilio.defaultDestination);
        //console.log('Sending notification via --> ' + util.inspect(req.body));
        var commMod = new Communications();
        commMod.getContactInfo(entity._id, req.session.user.email).then(function(user){
          console.log('Response from commMod.getContactInfo --> ' + JSON.stringify(user));
          // send urgent notifications
          if(req.body.sendNotifVia === 'text'){
            //send text
            var msg = {
              to: config.twilio.useDefault ? config.twilio.defaultDestination : user.cell,
              from: config.twilio.twilioPhone,
              body: 'URGENT: An urgent inquiry has been directed to you.',
              url:  config.email.emailLinkHost + '/inquiry/' + entity._id + '/dashboard'
            };
            commMod.sendText(msg);
          }

          if(req.body.sendNotifVia === 'voice'){
            var msg = {
              to:  config.twilio.useDefault ? config.twilio.defaultDestination : user.cell,
              from: config.twilio.twilioPhone,
              url: config.email.emailLinkHost + '/api/notification/voice-message/inquiry/' + entity._id,
              method: 'GET',
              fallbackMethod: 'GET',
              statusCallbackMethod: 'GET',
              record: false
            };
            commMod.sendVoice(msg);
          }

          // send email
          //console.log('Entity before mail options: ' + JSON.stringify(entity));
          var mailOptions = {
            to: config.twilio.useDefault ? config.email.defaultDestination : user.email,
            subject: entity.subject,
            data: entity,
            inquiryId: entity._id,
            url: config.email.emailLinkHost + '/inquiry/' + entity._id + '/dashboard',
            type: 'UrgentInquiry'
          };
          commMod.sendEmail(mailOptions);
        }, function(err){
          console.log('Error in sendUrgentMessage --> ' + JSON.stringify(err))
        });
      }
      return entity;
    }
    return null;
  };
}

// Updates status an existing Inquiry in the DB
export function updateStatus(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  // set the status
  req.body.status = req.params.status;
  // for ACKs, save the person who acknowledged the request
  if (req.params.status === 'ACK') {
    req.body.ackBy = req.params.who;
    req.body.ackDate = new Date();
  }

  return Inquiry.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Inquiry from the DB
export function destroy(req, res) {
  return Inquiry.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
