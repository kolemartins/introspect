'use strict';
import Inquiry from '../inquiry/inquiry.model';
import Note from '../note/note.model';

const util = require('util');

// Deletes a Note from the DB
export function voiceMessageUrgentResponse(req, res) {
  // lookup urgent note by note._id to retrieve voice message
  var noteid = req.params.noteId;
  Note.findOne({ _id: noteid }).exec(function(err, note){
    if(err) {
      console.log('Error while looking up note.  ID: ' + noteid);
      handleError(res);
    }
    //console.log('Sending voice message: ' + note.note);
    res.send('<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="woman" language="en-US">' + note.note + '</Say></Response>');
  })
}

export function voiceMessageUrgentInquiry(req, res) {
  // lookup urgent note by note._id to retrieve voice message
  var inquiryid = req.params.inquiryId;
  Inquiry.findOne({ _id: inquiryid }).exec(function(err, inquiry){
    if(err) {
      console.log('Error while looking up inquiry.  ID: ' + inquiryid);
      handleError(res);
    }
    //console.log('Sending voice message: ' + note.note);
    res.send('<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="woman" language="en-US">' + inquiry.message + '</Say></Response>');
  })
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}
