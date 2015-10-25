'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Poll = require('./poll.model');

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

describe('GET /api/polls', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/polls')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});

describe('POST /api/polls', function() {
  it('should save', function(done) {
    request(app)
      .post('/api/polls')
      .set('Content-Type', 'application/json')
      .send(pollArray)
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

  it('should delete', function(done) {
    request(app)
      .delete('/api/polls/' + objId)
      .expect(204)
      .end(function(err, res) {
        if (err) return done(err);

        Poll.findById(objId).then(function(found) {
          if (found) return done(err);
          done();
        });
    });
  });

  it('should fail on unfound reference', function(done) {
    poll.save(function(err, obj) {
      request(app)
        .delete('/api/polls/' + 'abcdef')
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
