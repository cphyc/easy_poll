'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

var User = require('../user/user.model');
var Poll = require('../poll/poll.model');
var Answer = require('./answer.model');

var pollArray = {
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
};

var pollObj;
before(function(done) {
  new Poll(pollArray).save(function(err, poll) {
    pollObj = poll;
    done();
  });
});

var userToken, userToken2, adminToken;
var user, user2;
// Authenticate as admin
before(function(done) {
  var testUser = {
    name: 'test',
    email: 'test@test.com',
    role: 'user',
    password: 'test'
  };
  new User(testUser).save(function(err, usr) {
    user = usr;

    request(app)
      .post('/auth/local')
      .set('Content-Type', 'application/json')
      .send({ "email": testUser.email, "password": testUser.password})
      .end(function(err, res) {
        userToken = res.body.token;
        done();
      });
  });
});

before(function(done) {
  var testUser = {
    name: 'test2',
    email: 'test2@test.com',
    role: 'user2',
    password: 'test2'
  };
  new User(testUser).save(function(err, usr) {
    user2 = usr;

    request(app)
      .post('/auth/local')
      .set('Content-Type', 'application/json')
      .send({ "email": testUser.email, "password": testUser.password})
      .end(function(err, res) {
        userToken2 = res.body.token;
        done();
      });
  });
});

before(function(done) {
  var adminUser = {
    name: 'admin',
    email: 'admin@admin.com',
    role: 'admin',
    password: 'admin'
  };
  new User(adminUser).save(function() {
    request(app)
      .post('/auth/local')
      .set('Content-Type', 'application/json')
      .send({ "email": adminUser.email, "password": adminUser.password})
      .end(function(err, res) {
        adminToken = res.body.token;
        done();
      });
  });
});

describe('GET /api/answers', function() {

  it('should fail for visitors', function(done) {
    request(app)
      .get('/api/answers')
      .expect('Content-Type', /json/)
      .expect(401)
      .end(function() {
        done();
      });
  });

  it('should fail for users', function(done) {
    request(app)
      .get('/api/answers')
      .set('Authorization', 'Bearer ' + userToken)
      .expect('Content-Type', /json/)
      .expect(401)
      .end(function() {
        done();
      });
  });

  it('should respond with JSON array for admins', function(done) {
    request(app)
      .get('/api/answers')
      .set('Authorization', 'Bearer ' + adminToken)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});

describe('GET /api/answers/:id', function() {
  var answer, route;
  before(function(done) {
    new Answer({
      poll: pollObj._id,
      answers: [3, 1],
      user: user
    }).save(function(err, obj) {
      if (err) {
        console.log(err, obj);
      }
      answer = obj;
      route = '/api/answers/' + obj._id;
      done();
    });
  });

  it('should fail for visitors', function(done) {
    request(app)
      .get(route)
      .expect(401)
      .expect('Content-Type', /json/)
      .end(function() {
        done();
      });
  });

  it('should fail for user who didn\'t create the answer', function(done) {
    request(app)
      .get(route)
      .set('Authorization', 'Bearer ' + userToken2)
      .expect(401)
      .expect('Content-Type', /json/)
      .end(function() {
        done();
      });
  });

  it('should succeed for user who created the answer', function(done) {
    request(app)
      .get(route)
      .set('Authorization', 'Bearer ' + userToken)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function() {
        done();
      });
  });

  it('should respond with JSON object for admins', function(done) {
    request(app)
      .get(route)
      .set('Authorization', 'Bearer ' + adminToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Object);
        done();
      });
  });
});
