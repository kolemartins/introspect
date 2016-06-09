/**
 * Attachment model events
 */

'use strict';

import {EventEmitter} from 'events';
import Attachment from './attachment.model';
var AttachmentEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
AttachmentEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Attachment.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    AttachmentEvents.emit(event + ':' + doc._id, doc);
    AttachmentEvents.emit(event, doc);
  }
}

export default AttachmentEvents;
