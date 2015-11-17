'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AnswerSchema = new Schema({
  poll: {type: Schema.Types.ObjectId, ref: 'Poll'},
  answers: [Number],
  user: {type: Schema.Types.ObjectId, ref: 'User'},
});

module.exports = mongoose.model('Answer', AnswerSchema);
