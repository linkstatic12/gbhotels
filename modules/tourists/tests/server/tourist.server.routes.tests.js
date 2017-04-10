'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Tourist = mongoose.model('Tourist'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, tourist;

/**
 * Tourist routes tests
 */
describe('Tourist CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Tourist
    user.save(function () {
      tourist = {
        name: 'Tourist name'
      };

      done();
    });
  });

  it('should be able to save a Tourist if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Tourist
        agent.post('/api/tourists')
          .send(tourist)
          .expect(200)
          .end(function (touristSaveErr, touristSaveRes) {
            // Handle Tourist save error
            if (touristSaveErr) {
              return done(touristSaveErr);
            }

            // Get a list of Tourists
            agent.get('/api/tourists')
              .end(function (touristsGetErr, touristsGetRes) {
                // Handle Tourist save error
                if (touristsGetErr) {
                  return done(touristsGetErr);
                }

                // Get Tourists list
                var tourists = touristsGetRes.body;

                // Set assertions
                (tourists[0].user._id).should.equal(userId);
                (tourists[0].name).should.match('Tourist name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Tourist if not logged in', function (done) {
    agent.post('/api/tourists')
      .send(tourist)
      .expect(403)
      .end(function (touristSaveErr, touristSaveRes) {
        // Call the assertion callback
        done(touristSaveErr);
      });
  });

  it('should not be able to save an Tourist if no name is provided', function (done) {
    // Invalidate name field
    tourist.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Tourist
        agent.post('/api/tourists')
          .send(tourist)
          .expect(400)
          .end(function (touristSaveErr, touristSaveRes) {
            // Set message assertion
            (touristSaveRes.body.message).should.match('Please fill Tourist name');

            // Handle Tourist save error
            done(touristSaveErr);
          });
      });
  });

  it('should be able to update an Tourist if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Tourist
        agent.post('/api/tourists')
          .send(tourist)
          .expect(200)
          .end(function (touristSaveErr, touristSaveRes) {
            // Handle Tourist save error
            if (touristSaveErr) {
              return done(touristSaveErr);
            }

            // Update Tourist name
            tourist.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Tourist
            agent.put('/api/tourists/' + touristSaveRes.body._id)
              .send(tourist)
              .expect(200)
              .end(function (touristUpdateErr, touristUpdateRes) {
                // Handle Tourist update error
                if (touristUpdateErr) {
                  return done(touristUpdateErr);
                }

                // Set assertions
                (touristUpdateRes.body._id).should.equal(touristSaveRes.body._id);
                (touristUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Tourists if not signed in', function (done) {
    // Create new Tourist model instance
    var touristObj = new Tourist(tourist);

    // Save the tourist
    touristObj.save(function () {
      // Request Tourists
      request(app).get('/api/tourists')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Tourist if not signed in', function (done) {
    // Create new Tourist model instance
    var touristObj = new Tourist(tourist);

    // Save the Tourist
    touristObj.save(function () {
      request(app).get('/api/tourists/' + touristObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', tourist.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Tourist with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/tourists/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Tourist is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Tourist which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Tourist
    request(app).get('/api/tourists/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Tourist with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Tourist if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Tourist
        agent.post('/api/tourists')
          .send(tourist)
          .expect(200)
          .end(function (touristSaveErr, touristSaveRes) {
            // Handle Tourist save error
            if (touristSaveErr) {
              return done(touristSaveErr);
            }

            // Delete an existing Tourist
            agent.delete('/api/tourists/' + touristSaveRes.body._id)
              .send(tourist)
              .expect(200)
              .end(function (touristDeleteErr, touristDeleteRes) {
                // Handle tourist error error
                if (touristDeleteErr) {
                  return done(touristDeleteErr);
                }

                // Set assertions
                (touristDeleteRes.body._id).should.equal(touristSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Tourist if not signed in', function (done) {
    // Set Tourist user
    tourist.user = user;

    // Create new Tourist model instance
    var touristObj = new Tourist(tourist);

    // Save the Tourist
    touristObj.save(function () {
      // Try deleting Tourist
      request(app).delete('/api/tourists/' + touristObj._id)
        .expect(403)
        .end(function (touristDeleteErr, touristDeleteRes) {
          // Set message assertion
          (touristDeleteRes.body.message).should.match('User is not authorized');

          // Handle Tourist error error
          done(touristDeleteErr);
        });

    });
  });

  it('should be able to get a single Tourist that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Tourist
          agent.post('/api/tourists')
            .send(tourist)
            .expect(200)
            .end(function (touristSaveErr, touristSaveRes) {
              // Handle Tourist save error
              if (touristSaveErr) {
                return done(touristSaveErr);
              }

              // Set assertions on new Tourist
              (touristSaveRes.body.name).should.equal(tourist.name);
              should.exist(touristSaveRes.body.user);
              should.equal(touristSaveRes.body.user._id, orphanId);

              // force the Tourist to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Tourist
                    agent.get('/api/tourists/' + touristSaveRes.body._id)
                      .expect(200)
                      .end(function (touristInfoErr, touristInfoRes) {
                        // Handle Tourist error
                        if (touristInfoErr) {
                          return done(touristInfoErr);
                        }

                        // Set assertions
                        (touristInfoRes.body._id).should.equal(touristSaveRes.body._id);
                        (touristInfoRes.body.name).should.equal(tourist.name);
                        should.equal(touristInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Tourist.remove().exec(done);
    });
  });
});
