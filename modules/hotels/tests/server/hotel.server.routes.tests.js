'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Hotel = mongoose.model('Hotel'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, hotel;

/**
 * Hotel routes tests
 */
describe('Hotel CRUD tests', function () {

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

    // Save a user to the test db and create new Hotel
    user.save(function () {
      hotel = {
        name: 'Hotel name'
      };

      done();
    });
  });

  it('should be able to save a Hotel if logged in', function (done) {
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

        // Save a new Hotel
        agent.post('/api/hotels')
          .send(hotel)
          .expect(200)
          .end(function (hotelSaveErr, hotelSaveRes) {
            // Handle Hotel save error
            if (hotelSaveErr) {
              return done(hotelSaveErr);
            }

            // Get a list of Hotels
            agent.get('/api/hotels')
              .end(function (hotelsGetErr, hotelsGetRes) {
                // Handle Hotel save error
                if (hotelsGetErr) {
                  return done(hotelsGetErr);
                }

                // Get Hotels list
                var hotels = hotelsGetRes.body;

                // Set assertions
                (hotels[0].user._id).should.equal(userId);
                (hotels[0].name).should.match('Hotel name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Hotel if not logged in', function (done) {
    agent.post('/api/hotels')
      .send(hotel)
      .expect(403)
      .end(function (hotelSaveErr, hotelSaveRes) {
        // Call the assertion callback
        done(hotelSaveErr);
      });
  });

  it('should not be able to save an Hotel if no name is provided', function (done) {
    // Invalidate name field
    hotel.name = '';

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

        // Save a new Hotel
        agent.post('/api/hotels')
          .send(hotel)
          .expect(400)
          .end(function (hotelSaveErr, hotelSaveRes) {
            // Set message assertion
            (hotelSaveRes.body.message).should.match('Please fill Hotel name');

            // Handle Hotel save error
            done(hotelSaveErr);
          });
      });
  });

  it('should be able to update an Hotel if signed in', function (done) {
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

        // Save a new Hotel
        agent.post('/api/hotels')
          .send(hotel)
          .expect(200)
          .end(function (hotelSaveErr, hotelSaveRes) {
            // Handle Hotel save error
            if (hotelSaveErr) {
              return done(hotelSaveErr);
            }

            // Update Hotel name
            hotel.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Hotel
            agent.put('/api/hotels/' + hotelSaveRes.body._id)
              .send(hotel)
              .expect(200)
              .end(function (hotelUpdateErr, hotelUpdateRes) {
                // Handle Hotel update error
                if (hotelUpdateErr) {
                  return done(hotelUpdateErr);
                }

                // Set assertions
                (hotelUpdateRes.body._id).should.equal(hotelSaveRes.body._id);
                (hotelUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Hotels if not signed in', function (done) {
    // Create new Hotel model instance
    var hotelObj = new Hotel(hotel);

    // Save the hotel
    hotelObj.save(function () {
      // Request Hotels
      request(app).get('/api/hotels')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Hotel if not signed in', function (done) {
    // Create new Hotel model instance
    var hotelObj = new Hotel(hotel);

    // Save the Hotel
    hotelObj.save(function () {
      request(app).get('/api/hotels/' + hotelObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', hotel.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Hotel with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/hotels/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Hotel is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Hotel which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Hotel
    request(app).get('/api/hotels/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Hotel with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Hotel if signed in', function (done) {
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

        // Save a new Hotel
        agent.post('/api/hotels')
          .send(hotel)
          .expect(200)
          .end(function (hotelSaveErr, hotelSaveRes) {
            // Handle Hotel save error
            if (hotelSaveErr) {
              return done(hotelSaveErr);
            }

            // Delete an existing Hotel
            agent.delete('/api/hotels/' + hotelSaveRes.body._id)
              .send(hotel)
              .expect(200)
              .end(function (hotelDeleteErr, hotelDeleteRes) {
                // Handle hotel error error
                if (hotelDeleteErr) {
                  return done(hotelDeleteErr);
                }

                // Set assertions
                (hotelDeleteRes.body._id).should.equal(hotelSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Hotel if not signed in', function (done) {
    // Set Hotel user
    hotel.user = user;

    // Create new Hotel model instance
    var hotelObj = new Hotel(hotel);

    // Save the Hotel
    hotelObj.save(function () {
      // Try deleting Hotel
      request(app).delete('/api/hotels/' + hotelObj._id)
        .expect(403)
        .end(function (hotelDeleteErr, hotelDeleteRes) {
          // Set message assertion
          (hotelDeleteRes.body.message).should.match('User is not authorized');

          // Handle Hotel error error
          done(hotelDeleteErr);
        });

    });
  });

  it('should be able to get a single Hotel that has an orphaned user reference', function (done) {
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

          // Save a new Hotel
          agent.post('/api/hotels')
            .send(hotel)
            .expect(200)
            .end(function (hotelSaveErr, hotelSaveRes) {
              // Handle Hotel save error
              if (hotelSaveErr) {
                return done(hotelSaveErr);
              }

              // Set assertions on new Hotel
              (hotelSaveRes.body.name).should.equal(hotel.name);
              should.exist(hotelSaveRes.body.user);
              should.equal(hotelSaveRes.body.user._id, orphanId);

              // force the Hotel to have an orphaned user reference
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

                    // Get the Hotel
                    agent.get('/api/hotels/' + hotelSaveRes.body._id)
                      .expect(200)
                      .end(function (hotelInfoErr, hotelInfoRes) {
                        // Handle Hotel error
                        if (hotelInfoErr) {
                          return done(hotelInfoErr);
                        }

                        // Set assertions
                        (hotelInfoRes.body._id).should.equal(hotelSaveRes.body._id);
                        (hotelInfoRes.body.name).should.equal(hotel.name);
                        should.equal(hotelInfoRes.body.user, undefined);

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
      Hotel.remove().exec(done);
    });
  });
});
