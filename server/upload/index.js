'use strict';

var express = require('express');
var multer = require('multer');
var config = require('../config/environment');
var auth = require('../auth/auth.service');
var path = require('path');
var fs = require('fs');

var app = express();
var router = express.Router();

var storage = multer.diskStorage({
  filename: function(req, file, cb) {
    cb(null, file.filename + '-' + Date.now());
  }
});

var upload = multer({dest: config.uploadDirectory, storage: storage});

router.post('/', auth.hasRole('user'), upload.single('data'), function(req, res) {
  res.json(req.file.filename);
});

router.get('/:filename', auth.hasRole('user'), function(req, res) {
  var path = path.resolve(app.get('appPath'), config.uploadDirectory, filename);
  fs.exists(path, function(exists) {
    if (exists) {
      res.sendFile(path.resolve(app.get('appPath'), config.uploadDirectory, filename));
    } else {
      res.status(404);
    }
  })
});

module.exports = router;
