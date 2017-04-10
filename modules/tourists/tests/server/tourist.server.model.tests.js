'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Tourist = mongoose.model('Tourist');

/**
 * Globals
 */
var user, tourist;

/**
 * Unit tests
 */
describe('Tourist Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() { 
      tourist = new Tourist({
        name: 'Tourist Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return tourist.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) { 
      tourist.name = '';

      return tourist.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    Tourist.remove().exec(function(){
      User.remove().exec(function(){
        done();  
      });
    });
  });
});
