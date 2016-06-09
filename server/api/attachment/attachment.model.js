'use strict';

import mongoose from 'mongoose';

var AttachmentSchema = new mongoose.Schema({
  fileName: String,
  contentType: String,
  encoding: String,
  uniqueFileName: String,
  inquiryId: String,
  noteId: String,
  uploadedBy: String,
  uploadDate: Date
});

export default mongoose.model('Attachment', AttachmentSchema);
