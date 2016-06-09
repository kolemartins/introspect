'use strict';

var express = require('express');
var controller = require('./inquiry.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/status/:status', controller.byStatus);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

router.get('/:id/status/:status/:who', controller.updateStatus);

module.exports = router;
