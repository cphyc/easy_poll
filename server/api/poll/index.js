'use strict';

var express = require('express');
var controller = require('./poll.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('user'), controller.index);
router.get('/:id', auth.hasRole('user'), controller.getPoll);
router.get('/:id/answers', auth.hasRole('admin'), controller.getAnswers);
router.get('/:id/results', auth.hasRole('admin'), controller.getResults);
router.post('/', auth.hasRole('manager'), controller.create);
router.put('/', auth.hasRole('manager'), controller.update);
router.patch('/:id', auth.hasRole('manager'), controller.update);
router.delete('/:id', auth.hasRole('manager'), controller.destroy);

module.exports = router;
