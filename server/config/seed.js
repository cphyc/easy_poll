/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Poll = require('../api/poll/poll.model');
var User = require('../api/user/user.model');

Poll.find({}).remove(function() {
  Poll.create({
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
  });
});

User.find({}).remove(function() {
  User.create({
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
  }, function() {
      console.log('finished populating users');
    }
  );
});
