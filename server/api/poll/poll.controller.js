'use strict';

var _ = require('lodash');
var Poll = require('./poll.model');
var Answer = require('../answer/answer.model');
var Q = require('q');

var path = require('path');
var convert = require('./convert');

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

      answers.forEach(function(answer) {
        while (answer.answers.length < answer.poll.questions.length) {
          answer.answers.push(-1);
        }
      });

      var correction = answers.map(function(answer) {
        var correction = answer.correction(answer.poll);

        return {
          user: answer.user,
          correction: correction,
          poll: answer.poll,
          answer: answer._id
        };
      }) || [];

      return res.json(correction);
    }, function(errs) {
      console.log(errs);
      return handleError(res, errs);
    });
};

exports.getResultsAsCsv = function(req, res) {
  // get the poll and the answers
  Answer.findByPoll(req.params.id)
    .populate('poll')
    .populate('user', 'name email')
    .then(function(answers) {
      if (!answers) { return res.status(404).send('Not Found'); }

      // Fill empty answers with '-1'
      answers.forEach(function(answer) {
        while (answer.answers.length < answer.poll.questions.length) {
          answer.answers.push(-1);
        }
      });

      // Create the header
      if (answers[0]) {
        var questions = answers[0].poll.questions;
      } else { var questions = []; }
      var header = ['Nom']
        .concat(questions.map(function(answer, key) {
          return 'Question n°'+(key+1);
        }))
        .concat(['Réponses justes']);

      // Generate the answers
      var answers = answers.map(function(answer) {
        var correction = answer.correction(answer.poll);

        var answers = correction.map(function(corr) { return (corr.goodAnswer ? '1' : '0'); });
        var totGoodAnswers = correction.reduce(function(agg, corr) {
          if (corr.goodAnswer) {
            return agg + 1;
          } else {
            return agg;
          }
        }, 0);
        var name = '?';
        if (answer.user && answer.user.name) {
          name = answer.user.name;
        }

        return [name].concat(answers).concat([totGoodAnswers]);
      }) || [];

      var correction = [header].concat(answers);

      convert.asCsv(correction).then(function(fileName) {
        res.sendFile(fileName);
      });
    }, function(errs) {
      console.log(errs);
      return handleError(res, errs);
    });
};


// Creates a new poll in the DB.
exports.create = function(req, res) {
  var poll = new Poll(req.body);
  poll.save(function(err) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(poll);
  });
};

// Updates an existing poll in the DB.
exports.update = function(req, res) {
  var id;
  if (req.body._id) {
    id = req.body._id;
  } else if (req.params.id) {
    id = req.paras.id;
  } else {
    id = null;
  }
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

exports.updateOrCreate = function(req, res) {
  var id;
  Poll.findById(req.body._id, function (err, poll) {
    var fun;
    if (err) { return handleError(res, err); }
    if(poll) {
      poll.name = req.body.name;
      poll.questions = req.body.questions;

      fun = poll.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(poll);
      });
    } else {
      return exports.create(req, res);
    }
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
  console.error(err);
  return res.status(500).send(err);
}
