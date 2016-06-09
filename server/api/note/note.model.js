'use strict';

import mongoose from 'mongoose';

var NoteSchema = new mongoose.Schema({
  inquiryId: String,
  type: String,
  note: String,
  urgent: Boolean,
  createdBy: String,
  createdDate: Date
});

export default mongoose.model('Note', NoteSchema);
