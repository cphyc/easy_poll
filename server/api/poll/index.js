'use strict';

var express = require('express');
var controller = require('./poll.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('user'), controller.index);
router.get('/:id', auth.hasRole('user'), controller.getPoll);
router.get('/:id/answers', auth.hasRole('admin'), controller.getAnswers);
router.get('/:id/results', auth.hasRole('admin'), controller.getResults);
router.get('/:id/results/csv', auth.hasRole('admin'), controller.getResultsAsCsv);
router.post('/', auth.hasRole('admin'), controller.updateOrCreate);
router.put('/', auth.hasRole('admin'), controller.updateOrCreate);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
