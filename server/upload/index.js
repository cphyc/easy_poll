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
    cb(null, path.resolve(config.root, config.uploadDirectory));
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

var upload = multer({storage: storage});

router.post('/', auth.hasRole('user'), upload.single('picture'), function(req, res) {
  res.json('upload/' + req.file.filename);
});

router.get('/last/:n', function(req, res){
  fs.readdir(path.resolve(config.root, config.uploadDirectory), function(err, files) {
    if (err) return res.status(500).send(err);

    var list = (files || []).sort().reverse().filter(function(val, index) {
      return (index < req.params.n);
    }).map(function(imgPath) {
      return 'upload/' + imgPath;
    });

    return res.json(list);
  });
});

module.exports = router;
