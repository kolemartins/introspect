'use strict';

import mongoose from 'mongoose';

var TopicSchema = new mongoose.Schema({
  name: String,
  description: String,
  active: Boolean,
  default: Boolean
});

export default mongoose.model('Topic', TopicSchema);
