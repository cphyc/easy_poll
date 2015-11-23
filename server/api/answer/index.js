'use strict';

var express = require('express');
var controller = require('./answer.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.hasRole('user'), controller.show);
router.get('/for/:id', auth.hasRole('admin'), controller.findByPoll);
router.post('/', auth.hasRole('user'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
