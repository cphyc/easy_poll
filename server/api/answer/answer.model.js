'use strict';

var idValidator = require('mongoose-id-validator');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Poll = require('../poll/poll.model'),
    User = require('../user/user.model');

var AnswerSchema = new Schema({
  poll: {type: Schema.Types.ObjectId, ref: 'Poll'},
  answers: [Number],
  user: {type: Schema.Types.ObjectId, ref: 'User'},
});

AnswerSchema.methods.correction = function(poll) {
  var self = this;
  var ans = self.answers.map(function(answer, index) {
    return {
      question: poll.questions[index],
      givenAnswer: answer,
      expectedAnswer: poll.questions[index].answer,
      goodAnswer: answer === poll.questions[index].answer
    };
  });
  return ans;
};

AnswerSchema.statics.findByPoll = function(pollId) {
  var id = new Schema.Types.ObjectId(pollId);
  return this
    .find({ "poll": pollId });
};

AnswerSchema
  .plugin(idValidator)
  .pre('validate', function(next) {
    var self = this;
    var pollPromise = Poll.findById(self.poll);
    pollPromise.then(function(poll) {
      // check the correct number of answers
      if (self.answers.length > poll.questions.length) {
        next(new Error('Bad number of answers given.'));
      }
      // Check each answer is within range
      var inRange = self.answers.every(function(answer, index) {
        return (0 <= answer) && (answer < poll.questions[index].answers.length);
      });

      if (!inRange) {
        next(new Error('Answer out of range'));
      }

      next();
    });

  });


module.exports = mongoose.model('Answer', AnswerSchema);
