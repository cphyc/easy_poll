'use strict';

var _ = require('lodash');
var Poll = require('./poll.model');
var Answer = require('../answer/answer.model');
var Q = require('q');

var ObjectId = require('mongoose').Schema.ObjectId;

// Get list of polls
exports.index = function(req, res) {
  Poll.find(function (err, polls) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(polls);
  });
};

// Get a single poll
exports.getPoll = function(req, res) {
  if (req.user.role == 'admin') {
    var selectCriteria = '';
  } else if (req.user.role == 'user') {
    var selectCriteria = '-questions.answer';
  }

  Poll.findById(req.params.id)
    .select(selectCriteria)
    .exec(function (err, poll) {
      if(err) { return handleError(res, err); }
      if(!poll) { return res.status(404).send('Not Found'); }
      return res.json(poll);
    });
};

// Get the answers
exports.getAnswers = function(req, res) {
  Answer.find({poll: req.params.id}, function(err, answer) {
    if (err) { return handleError(res, err); }
    if (!answer) { return res.status(404).send('Not Found'); }

    return res.json(answer);
  });
};

// Get the results of a poll
exports.getResults = function(req, res) {
  // get the poll and the answers
  Answer.findByPoll(req.params.id)
    .populate('poll')
    .populate('user', 'name email')
    .then(function(answers) {
      if (!answers) { return res.status(404).send('Not Found'); }

      var correction = answers.map(function(answer) {
        var correction = answer.correction(answer.poll);

        return {
          user: answer.user,
          correction: correction,
          poll: answer.poll
        };
      }) || [];

      return res.json(correction);
    }, function(errs) {
      console.log(errs);
      return handleError(res, errs);
    });
};


// Creates a new poll in the DB.
exports.create = function(req, res) {
  Poll.create(req.body, function(err, poll) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(poll);
  });
};

// Updates an existing poll in the DB.
exports.update = function(req, res) {
  Poll.findById(req.body._id, function (err, poll) {
    if (err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }

    poll.name = req.body.name;
    poll.questions = req.body.questions;

    poll.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(poll);
    });
  });
};

// Deletes a poll from the DB.
exports.destroy = function(req, res) {
  Poll.findById(req.params.id, function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }
    poll.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
