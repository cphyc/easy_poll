'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PollSchema = new Schema({
  name: {type: String, minlength: 1},
  questions: [{
    question: String,
    answers: [String],
    answer: Number
  }]
});

PollSchema
  .path('questions')
  .validate(function(questions, respond) {
    if (!questions || questions.length === 0) respond(false);
    else respond(true);
  }, 'You have to ask a question')
  .validate(function(questions, respond) {
    questions.forEach(function(q) {
      if (q.question === '') respond(false)
      else if (q.answers.length === 0) respond(false)
      else if (0 > q.answer || q.answer > q.answers.length - 1) respond(false);
      else respond(true);
    });
  }, 'Malformed questions');

module.exports = mongoose.model('Poll', PollSchema);
