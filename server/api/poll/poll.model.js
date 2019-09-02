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
  .validate(function(questions) {
    if (!questions || questions.length === 0) return false;
    else return true;
  }, 'You have to ask a question')
  .validate(function(questions) {
    questions.forEach(function(q) {
      if (q.question === '') return false;
      else if (q.answers.length === 0) return false;
      else if (0 > q.answer || q.answer > q.answers.length - 1) return false;
      else return true;
    });
  }, 'Malformed questions');

module.exports = mongoose.model('Poll', PollSchema);
