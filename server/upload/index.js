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
  destination: function(req, file, cb) {
    cb(null, config.uploadDirectory);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

var upload = multer({storage: storage});

router.post('/', auth.hasRole('user'), upload.single('picture'), function(req, res) {
  console.log(req.file, config.uploadDirectory);
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
