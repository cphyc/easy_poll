'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

var User = require('../user/user.model');
var Poll = require('../poll/poll.model');
var Answer = require('./answer.model');

var globals = {};

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

// Delete all users and poll
before(function(done) {
  User.find().remove(function() {
    Poll.find().remove(function() {
      Answer.find().remove(function() {
        done();
      });
    });
  });
});

before(function(done) {
  new Poll(pollArray).save(function(err, poll) {
    globals.poll = poll;
    done();
  });
})

var userToken, userToken2, adminToken;
// Authenticate as admin
var testUser = {
  name: 'test',
  email: 'foo@bar.com',
  role: 'user',
  password: 'test'
};

before(function(done) {
  new User(testUser).save(function(err, usr) {
    globals.user = usr;
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

var testUser2 = {
  name: 'test2',
  email: 'foo2@bar.com',
  role: 'user',
  password: 'test2'
};
before(function(done) {
  new User(testUser2).save(function(err, usr) {
    globals.user2 = usr;
    request(app)
      .post('/auth/local')
      .set('Content-Type', 'application/json')
      .send({ "email": testUser2.email, "password": testUser2.password})
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

before(function(done) {
  new Answer({
    'poll': globals.poll._id,
    'answers': [],
    'user': globals.user
  }).save(function(err, obj) {
    globals.answer = obj;
    done();
  });
});

describe('GET /api/answers', function() {

  it('should fail for visitors', function(done) {
    request(app)
      .get('/api/answers')
      .expect(401)
      .end(function(err, ans) {
        done(err);
      });
  });

  it('should fail for users', function(done) {
    request(app)
      .get('/api/answers')
      .set('Authorization', 'Bearer ' + userToken)
      .expect(403)
      .end(function(err) {
        done(err);
      });
  });

  it('should respond with JSON array for admins', function(done) {
    request(app)
      .get('/api/answers')
      .set('Authorization', 'Bearer ' + adminToken)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        res.body.should.be.instanceof(Array);
        res.body.length.should.equal(1);
        done(err);
      });
  });
});

describe.only('GET /api/answers/poll/:pollId', function() {
  var answer, route;
  before(function(done) {
    Poll.findOne({}).then(function(poll) {
      route = '/api/answers/poll/' + poll._id;
      done();
    });
  });

  it('should fail for visitors', function(done) {
    request(app)
    .get(route)
    .expect(401)
    .end(function(err) {
      done(err);
    });
  });

  it('should return a fresh answer on first visit', function(done) {
    request(app)
    .get(route)
    .set('Authorization', 'Bearer ' + userToken)
    .expect(200)
    .end(function(err, res) {
      if (err) done(err);
      res.body.should.be.instanceof(Object);
      answer = res.body;
      done();
    });
  });

  it('should return the same answer on second visit', function(done) {
    request(app)
    .get(route)
    .set('Authorization', 'Bearer ' + userToken)
    .expect(200)
    .end(function(err, res) {
      if (err) done(err);
      res.body._id.should.equal(answer._id);
      done()
    });
  });

  it('should return another new one to another user', function(done) {
    request(app)
    .get(route)
    .set('Authorization', 'Bearer ' + userToken2)
    .expect(200)
    .end(function(err, res) {
      if (err) done(err);
      res.body._id.should.not.equal(answer._id);
      done()
    });
  });

  describe('GET answer/:id', function() {
    var ansRoute;
    before(function(done) {
      ansRoute = route + '/answer/' + answer._id;
      done();
    });

    it('should fail for visitor', function(done) {
      request(app)
      .get(ansRoute)
      .expect(401)
      .end(function(err) {
        done(err);
      });
    });

    it('should fail for non owner', function(done) {
      request(app)
      .get(ansRoute)
      .set('Authorization', 'Bearer ' + userToken2)
      .expect(401)
      .end(function(err) {
        done(err);
      });
    });
    it('should succeed for admin', function(done) {
      request(app)
      .get(ansRoute)
      .set('Authorization', 'Bearer ' + adminToken)
      .expect(200)
      .end(function(err) {
        done(err);
      });
    });
    it('should succeed for owner', function(done) {
      request(app)
      .get(ansRoute)
      .set('Authorization', 'Bearer ' + userToken)
      .expect(200)
      .end(function(err) {
        done(err);
      });
    });
  });
  describe('GET user/:userId', function() {
    var ansRoute;
    before(function(done) {
      ansRoute = route + '/user/' + globals.user._id;
      done();
    });

    it('should fail for visitor', function(done) {
      request(app)
      .get(ansRoute)
      .expect(401)
      .end(function(err) {
        done(err);
      });
    });

    it('should fail for non owner', function(done) {
      request(app)
      .get(ansRoute)
      .set('Authorization', 'Bearer ' + userToken2)
      .expect(200)
      .end(function(err, res) {
        res.body._id.should.not.equal(answer._id);
        done(err);
      });
    });
    it('should succeed for admin', function(done) {
      request(app)
      .get(ansRoute)
      .set('Authorization', 'Bearer ' + adminToken)
      .expect(200)
      .end(function(err) {
        done(err);
      });
    });
    it('should succeed for owner', function(done) {
      request(app)
      .get(ansRoute)
      .set('Authorization', 'Bearer ' + userToken)
      .expect(200)
      .end(function(err) {
        done(err);
      });
    });
  });

  describe('POST question/:question/:answer', function() {
    var postRoute;
    before(function(done) {
      postRoute = route + '/question/';
      done();
    });

    it('should fail for visitor', function(done) {
      request(app)
      .post(postRoute+'0/2')
      .expect(401)
      .end(function(err) {
        done(err);
      });
    });
    it('should work for new answer to new question', function(done) {
      request(app)
      .post(postRoute+'0/2')
      .set('Authorization', 'Bearer ' + userToken)
      .expect(201)
      .end(function(err) {
        done(err);
      });
    });
    it('should work for new answer to new question', function(done) {
      request(app)
      .post(postRoute+'1/3')
      .set('Authorization', 'Bearer ' + userToken)
      .expect(201)
      .end(function(err) {
        done(err);
      });
    });

    it('should fail for new answer to same question', function(done) {
      request(app)
      .post(postRoute+'0/2')
      .set('Authorization', 'Bearer ' + userToken)
      .expect(500)
      .end(function(err) {
        done(err);
      });
    });
    it('should fail for out of range answer', function(done) {
      request(app)
      .post(postRoute+'3/2')
      .set('Authorization', 'Bearer ' + userToken)
      .expect(500)
      .end(function(err) {
        done(err);
      });
    });
  });
});

describe('GET /api/answers/:id', function() {
  var answer, route;
  before(function(done) {
    route = '/api/answers/' + globals.answer._id;
    answer = globals.answer;
    done();
  });

  it('should fail for visitors', function(done) {
    request(app)
      .get(route)
      .expect(401)
      .end(function(err) {
        done(err);
      });
  });

  it('should fail for user who didn\'t create the answer', function(done) {
    request(app)
      .get(route)
      .set('Authorization', 'Bearer ' + userToken2)
      .expect(401)
      .end(function(err) {
        done(err);
      });
  });

  it('should succeed for user who created the answer', function(done) {
    request(app)
      .get(route)
      .set('Authorization', 'Bearer ' + userToken)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err) {
        done(err);
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
        done(err);
      });
  });
});

describe('POST /api/answers', function() {

  it('should fail for visitors', function(done) {
    request(app)
      .post('/api/answers')
      .set('Content-Type', 'application/json')
      .send({})
      .expect(401)
      .end(function(err) {
        done(err)
      });
  });

  it('should accept good requests', function(done) {
    request(app)
      .post('/api/answers')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + userToken)
      .send({
        'user': globals.user._id,
        'poll': globals.poll._id,
        'answers': [3, 1]
      })
      .expect(201)
      .end(function(err, foo) {
        done(err)
      });
  });

  describe('(malformed answers)', function() {
    function pleasePost(done, userId, pollId, answers, errCode) {
       request(app)
        .post('/api/answers')
        .set('Authorization', 'Bearer ' + userToken)
        .set('Content-Type', 'application/json')
        .send({
          user: userId,
          poll: pollId,
          answers: answers
        })
        .expect(errCode)
        .end(function(err) {
          done(err);
        });
    }

    var good = {};

    before(function() {
      good = {
        poll: globals.poll._id,
        user: globals.user._id,
        answers: [1, 2]
      }
    });

    it('should fail when missing user is given', function(done) {
      var badUserId = good.poll;
      pleasePost(done, badUserId, good.poll, good.answers, 404)
    });
    it('should fail when missing poll is given', function(done) {
      var badPollId = good.user;
      pleasePost(done, good.user, badPollId, good.answers, 404)
    });
    it('should fail when malformed answers are given', function(done) {
      pleasePost(done, good.user, good.poll, 'hello, I say I\'m an answer but I\'m not', 500);
    })
    it('should fail when out-of-range answers are given ', function(done) {
      pleasePost(done, good.user, good.poll, [100, 0], 500);
    });
    it('should fail when too many answers are given ', function(done) {
      pleasePost(done, good.user, good.poll, [100, 0, 1, 1], 500);
    });
    it('should fail when too few answers are given ', function(done) {
      pleasePost(done, good.user, good.poll, [100], 500);
    });
  });
});
