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

// Get list of answers of one poll
exports.indexForOnePoll = function(req, res) {
  Answer.find({poll: req.params.pollId}, function (err, answers) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(answers);
  });
};

// Return a fresh answer object or an existing one if any
exports.newAnswer = function(req, res) {
  Answer.findAnswer(req.params.pollId.toString(), req.user._id.toString())
    .then(function(answer) {
      // If not existing, create the new answer document and return it immediately
      if (!answer) {
        Answer.create({
          poll: req.params.pollId,
          answers: [],
          user: req.user._id.toString()
        }, function(err, newAnswer) {
          if (err) { return handleError(res, err); }
          return res.json(newAnswer);
        });
      } else { return res.json(answer); }
  }).catch(function(err) {
    return handleError(res, err);
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
  Answer.findOne({poll: req.params.pollId, _id: req.params.id}, function (err, answer) {
    if(err) { return handleError(res, err); }
    if(!answer) { return res.json([]); }

    if (isAdminOrOwns(req, answer)) {
      return res.json(answer);
    } else {
      return res.status(403).send('Forbidden');
    }
  });
};

// Get a single answer searching by user ids
exports.showByUser = function(req, res) {
  Answer.findOne({user: req.user._id.toString(), poll: req.params.pollId}, function (err, answer) {
    if(err) { return handleError(res, err); }
    if(!answer) { return res.json({answer: null}); }

    if (isAdminOrOwns(req, answer)) {
      return res.json(answer);
    } else {
      return res.status(403).send('Forbidden');
    }
  });
};

// Save a new answer in the DB.
exports.saveAnswer = function(req, res) {
  var userId = req.user._id.toString(),
      pollId = req.params.pollId,
      question = parseInt(req.params.question),
      answer = parseInt(req.params.answer);

  var pollProm = Poll.findById(pollId),
      userProm = User.findById(userId),
      answerProm = Answer.findOne({user: userId, poll: pollId});

  return Q.all([pollProm, userProm, answerProm])
  .then(function(results) {
    var poll = results[0],
        user = results[1],
        answersObj = results[2];
    // check both poll and user exists
    if (!poll || !user) {
      return res.status(404).send('Not Found');
    }

    if (!isAdminOrOwns(req, answersObj)) {
      return res.status(403).send('Forbidden');
    }

    if (question >= poll.questions.length) {
      return res.status(500).send('Out of range');
    }

    if (answersObj.answers[question] === undefined) {

      answersObj.addAnswer(question, answer)
      .then(function(newAnswer) {
        return res.status(201).json(newAnswer)
      }, function(err) {
        return handleError(res, err);
      });
    } else {
      throw new Error('Answer already given');
    }
  }).catch(function(err) {
    return handleError(res, err);
  });
};

// Updates an existing answer in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }

  Answer.findOne({_id: req.params.id, poll: req.params.pollId}, function (err, answer) {
    // checks for inconsistencies
    if (err) { return handleError(res, err); }
    if(!answer) { return res.status(404).send('Not Found'); }

    // check user rights
    if (!isAdminOrOwns(req, answer)) {
      return res.status(403).send('Forbidden');
    }

    var updated = _.merge(answer, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(answer);
    });
  });
};

// Deletes an answer from the DB.
exports.destroy = function(req, res) {
  Answer.findOne({_id: req.params.id, poll: req.params.pollId}, function (err, answer) {
    if(err) { return handleError(res, err); }
    if(!answer) { return res.status(404).send('Not Found'); }
    answer.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  console.log('E:', err);
  return res.status(500).send(err);
}
