'use strict';

var express = require('express');
var controller = require('./answer.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:pollId', auth.hasRole('admin'), controller.indexForOnePoll);
router.get('/:pollId/:id', auth.hasRole('user'), controller.show);
router.get('/:pollId/user/:userId', auth.hasRole('user'), controller.showByUser);
router.post('/:pollId', auth.hasRole('user'), controller.create);
router.put('/:pollId/:id', auth.hasRole('user'), controller.update);
router.patch('/:pollId/:id', auth.hasRole('admin'), controller.update);
router.delete('/:pollId/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
