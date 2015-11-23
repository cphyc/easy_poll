/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Q = require('q');
var Poll = require('../api/poll/poll.model');
var User = require('../api/user/user.model');
var Answer = require('../api/answer/answer.model');

var polls = [{
  name : 'About distance',
  questions: [{
    question: 'What\'s the shortest distance?',
    answers: ['Moon-earth', 'Earth-sun', 'Sun-Moon', 'You and me'],
    answer: 3
  }, {
    question: 'Order these from the smallest to the largest. 1) Atom, 2) Human being, 3) the earth, 4) the Universe',
    answers: ['1, 2, 3, 4', '1, 2, 4, 3', '1, 3, 2, 4', '1, 3, 4, 2'],
    answer : 1
  }]
}, {
  name : 'About time',
  questions: [{
    question: 'Who\'s older?',
    answers: ['You', 'Me', 'Her'],
    answer: 2
  }, {
    question: 'What takes the longest?',
    answers: ['1, 2, 3, 4', 'Back and forth to the moon', 'Buy a sandwich', 'Learn the bible by hearth'],
    answer : 1
  }]
}];

var users = [{
  provider: 'local',
  name: 'Test User',
  email: 'test@test.com',
  password: 'test'
}, {
  provider: 'local',
  role: 'admin',
  name: 'Admin',
  email: 'admin@admin.com',
  password: 'admin'
}];

var userObjs, pollObjs;
Q.all([
  Poll.find({}).remove(),
  User.find({}).remove(),
  Answer.find({}).remove()
]).then(function() {
  console.log('Depopulating everything');
  process.stdout.write('Populating polls…');

  return Q.all(polls.map(function(poll) { return Poll.create(poll); }));
}).then(function(polls) {
  pollObjs = polls;
  console.log('done!');
  process.stdout.write("Populating user…");

  return Q.all(users.map(function(user) { return User.create(user); }));
}).then(function(users) {
  userObjs = users;
  console.log('done!');
  process.stdout.write("Populating questions…");

  var corrects = pollObjs.map(function(poll) {
    var answers = poll.questions.map(function(q) { return q.answer; });

    return Answer.create({
      poll: poll._id,
      answers: answers,
      user: userObjs[0]._id
    });
  });
  var incorrects = pollObjs.map(function(poll) {
    var answers = poll.questions.map(function(q) { return 0; });

    return Answer.create({
      poll: poll._id,
      answers: answers,
      user: userObjs[0]._id
    });
  });
  return corrects.concat(incorrects);
}).then(function() {
  console.log('done!');
});
