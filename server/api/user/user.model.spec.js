'use strict';

var should = require('should');
var app = require('../../app');
var User = require('./user.model');

var user;
var userData = {
  provider: 'local',
  name: 'Fake User',
  email: 'test@test.com',
  password: 'password'
};

describe('User Model', function() {
  before(function(done) {
    // Clear users before testing
    User.remove().exec().then(function() {
      done();
    });
  });

  beforeEach(function() {
    user = new User(userData);
  });

  afterEach(function(done) {
    User.remove().exec().then(function() {
      done();
    });
  });

  it('should begin with no users', function(done) {
    User.find({}, function(err, users) {
      users.should.have.length(0);
      done();
    });
  });

  it('should fail when saving a duplicate user', function(done) {
    user.save(function() {
      var userDup = new User(userData);
      userDup.save(function(err) {
        console.log("Error:" + err);
        should.exist(err);
        done();
      });
    });
  });

  it('should fail when saving with a bad role', function(done) {
    user.role = 'foobar';
    user.save(function(err) {
      should.exist(err);
      done();
    });
  });
  it('should work when saving with a good role', function(done) {
    user.role = 'admin';
    user.save(function(err) {
      console.log(err);
      if (err) done(err);
      else done();
    });
  });

  it("should authenticate user if password is valid", function() {
    return user.authenticate('password').should.be.true;
  });

  it("should not authenticate user if password is invalid", function() {
    return user.authenticate('blah').should.not.be.true;
  });
});
