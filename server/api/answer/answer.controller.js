'use strict';

var _ = require('lodash');
var Q = require('q');
var Answer = require('./answer.model');
var Poll = require('../poll/poll.model');
var User = require('../user/user.model');

// Get list of answers
exports.index = function(req, res) {
  Answer.find(function (err, answers) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(answers);
  });
};

function isAdminOrOwns(req, answer) {
  // assess that this user created the answer or is admins
  var userId = req.user._id.toString();
  var answerUserId = answer.user.toString();

  if (userId === answerUserId || req.user.role === 'admin') {
    return true;
  } else {
    return false;
  }
}

// Get a single answer
exports.show = function(req, res) {
  Answer.findById(req.params.id, function (err, answer) {
    if(err) { return handleError(res, err); }
    if(!answer) { return res.status(404).send('Not Found'); }

    if (isAdminOrOwns(req, answer)) {
      return res.json(answer);
    } else {
      return res.status(401).send('Unauthorized');
    }
  });
};

// Creates a new answer in the DB.
exports.create = function(req, res) {
  var userId = req.body.user,
      pollId = req.body.poll;

  var pollProm = Poll.findById(pollId),
      userProm = User.findById(userId),
      answerProm = Answer.find({user: {_id: userId}});

  Q.all([pollProm, userProm, answerProm])
  .then(function(results) {
    var poll = results[0], user = results[1], answer = results[2];
    // check both poll and user exists
    if (!poll || !user) {
      console.log(poll, user);
      return res.status(404).send('Not Found');
    }

    // Answer already exists for user
    if (answer.length > 0) {
      // FIXME: good status
      return res.stauts(409).send('Answer already exists');
    }

    console.log('Here');
    // Create the answer
    return Answer.create(req.body, function(err, answer) {
      if(err) { return handleError(res, err); }
      return res.status(201).json(answer);
    });

  }, function(err) {
    return handleError(res, err);
  });
};

// Updates an existing answer in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }

  Answer.findById(req.params.id, function (err, answer) {
    // checks for inconsistencies
    if (err) { return handleError(res, err); }
    if(!answer) { return res.status(404).send('Not Found'); }

    // check user rights
    if (!isAdminOrOwns(req, answer)) {
      return res.status(401).send('Unauthorized');
    }

    var updated = _.merge(answer, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(answer);
    });
  });
};

// Deletes a answer from the DB.
exports.destroy = function(req, res) {
  Answer.findById(req.params.id, function (err, answer) {
    if(err) { return handleError(res, err); }
    if(!answer) { return res.status(404).send('Not Found'); }
    answer.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
