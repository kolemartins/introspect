'use strict';

import mongoose from 'mongoose';

var InquirySchema = new mongoose.Schema({
  status: String, // current status of inquiry (OPEN, ACK, CLOSED, RSP)
  type: String, // business ot technical related inquiry
  topic: String, // the subject matter of the request
  person: String, // the person to whom the inquiry is currently directed
  message: String, // the actual question and / or request
  priority: String, // the urgency of the request (1 = low, 5 = high)
  subject: String, // the subject line (short description) of the request
  requestedBy: String, // the person who made the initial request
  requestDate: Date, // timestamp of when the request was made
  closeDate: Date, // the date the request was closed
  ackBy: String, // the individual who initially acknowledged the request
  ackDate: Date, // the date the request was acknowledged
  escalated: Boolean // a flag indicating whether this request has been escalated to management
});

export default mongoose.model('Inquiry', InquirySchema);
