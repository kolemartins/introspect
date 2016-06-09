/**
 * Inquiry model events
 */

'use strict';

import {EventEmitter} from 'events';
import Inquiry from './inquiry.model';
var InquiryEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
InquiryEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Inquiry.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    InquiryEvents.emit(event + ':' + doc._id, doc);
    InquiryEvents.emit(event, doc);
  }
}

export default InquiryEvents;
