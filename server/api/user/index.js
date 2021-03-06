'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.hasRole('user'), controller.me);
router.put('/:id/password', auth.hasRole('user'), controller.changePassword);
router.get('/:id', auth.hasRole('user'), controller.show);
router.post('/', auth.hasRole('admin'), controller.create);

module.exports = router;
