'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Poll = require('./poll.model');
var User = require('../user/user.model');

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
var poll = new Poll(pollArray);

var userToken, adminToken;
// Authenticate as admin
before(function(done) {
  var testUser = {
    name: 'test',
    email: 'test@test.com',
    role: 'user',
    password: 'test'
  };
  new User(testUser).save(function() {
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

describe('GET /api/polls', function() {

  it('should respond with JSON array for users', function(done) {
    request(app)
      .get('/api/polls')
      .set('Authorization', 'Bearer ' + userToken)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });

  it('should fail for visitors', function(done) {
    request(app)
      .post('/api/polls/')
      .send(pollArray)
      .expect(401)
      .end(function() {
        done();
      });
  });
});

describe('GET /api/polls/:id', function() {
  var objId;
  beforeEach(function(done) {
    poll.save(function(err, obj) {
      objId = obj._id;
      done();
    });
  });

  describe('for visitors', function() {
    it('should fail', function(done) {
      request(app)
        .post('/api/polls/' + objId)
        .send(pollArray)
        .expect(401)
        .end(function() {
          done();
        });
    });
  });

  describe('for users', function() {
    it('should respond with a JSON object without the answers', function(done) {
      request(app)
        .get('/api/polls/' + objId)
        .set('Authorization', 'Bearer ' + userToken)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Object);
          res.body.questions.forEach(function(question) {
            (question.answer === undefined).should.be.true;
            question.answers.should.be.instanceof(Array);
          });
          done();
        });
    });
  });

  describe('for admins', function() {
    it('should respond with a JSON object with the answers', function(done) {
      request(app)
        .get('/api/polls/' + objId)
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Object);
          res.body.questions.forEach(function(question) {
            question.answer.should.be.instanceof(Number);
            question.answers.should.be.instanceof(Array);
          });
          done();
        });
    });
  });


  it('should fail for visitors', function(done) {
    request(app)
      .post('/api/polls/' + objId)
      .send(pollArray)
      .expect(401)
      .end(function() {
        done();
      });
  });
});

describe('POST /api/polls', function() {
  it('should fail for users', function(done) {
    request(app)
      .post('/api/polls/')
      .set('Authorization', 'Bearer ' + userToken)
      .send(pollArray)
      .expect(401)
      .end(function() {
        done();
      });
  });

  it('should save for admins', function(done) {
    request(app)
      .post('/api/polls')
      .set('Authorization', 'Bearer ' + adminToken)
      .send(pollArray)
      .set('Content-Type', 'application/json')
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  it('should fail with bad data', function(done) {
    request(app)
      .post('/api/polls')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken)
      .send({test: 1})
      .expect(500)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});

describe('DELETE /api/polls', function() {
  var objId;
  beforeEach(function(done) {
    poll.save(function(err, obj) {
      objId = obj._id;
      done();
    });
  });

  afterEach(function(done) {
    Poll.remove().exec().then(function() {
      done();
    });
  });

  it('should delete for admins', function(done) {
    request(app)
      .delete('/api/polls/' + objId)
      .set('Authorization', 'Bearer ' + adminToken)
      .expect(204)
      .end(function(err, res) {
        if (err) return done(err);

        Poll.findById(objId).then(done);
    });
  });

  it('should fail for users', function(done) {
    request(app)
      .delete('/api/polls/' + objId)
      .set('Authorization', 'Bearer ' + userToken)
      .expect(401)
      .end(function() {
        // Check it hasn't been deleted
        Poll.findById(objId).then(done);
      });
  });

  it('should fail on unfound reference', function(done) {
    poll.save(function(err, obj) {
      request(app)
        .delete('/api/polls/' + 'abcdef')
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(500)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
  });
});

describe('poll model', function() {
  before(function(done) {
    // Remove all polls before testing
    Poll.remove().exec().then(function() {
      done();
    });
  });

  afterEach(function(done) {
    Poll.remove().exec().then(function() {
      done();
    });
  });

  it('should fail if no questions are provided', function(done) {
    new Poll({
      name: 'foo',
      questions: []
    }).save(function(err) {
      should.exist(err);
      done();
    });
  });

  describe('incomplete questions', function() {
    it('should fail if a question asks no question', function(done) {
      new Poll({
        name: 'foo',
        questions: [{
        }]
      }).save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should fail if a question proposes no answer', function(done) {
      new Poll({
        name: 'foo',
        questions: [{
          question: 'What\'s up?'
        }]
      }).save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should fail if a question\'s answer if < 0', function(done) {
      new Poll({
        name: 'foo',
        questions: [{
          question: 'What\'s up?',
          answers: ['fine', 'sad'],
          answer: -1
        }]
      }).save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should fail if a question\'s answer if > number of answer', function(done) {
      new Poll({
        name: 'foo',
        questions: [{
          question: 'What\'s up?',
          answers: ['fine', 'sad'],
          answer: 2
        }]
      }).save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  it('should fail if the poll has no name', function(done) {
    new Poll({
      name: '',
      questions: [{
        question: 'What\'s up?',
        answers: ['fine', 'sad'],
        answer: 2
      }]
    }).save(function(err) {
      should.exist(err);
      done();
    });
  });

  it('should work if not malformed', function(done) {
    poll.save(function(err) {
      should.not.exist(err);

      done();
    });
  });

});
