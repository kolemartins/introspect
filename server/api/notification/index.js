'use strict';

var express = require('express');
var controller = require('./notification.controller');

var router = express.Router();

router.get('/voice-message/response/:noteId', controller.voiceMessageUrgentResponse);
router.get('/voice-message/inquiry/:inquiryId', controller.voiceMessageUrgentInquiry);
module.exports = router;
