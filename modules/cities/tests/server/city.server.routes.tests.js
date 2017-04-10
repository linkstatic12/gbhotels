'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  City = mongoose.model('City'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, city;

/**
 * City routes tests
 */
describe('City CRUD tests', function () {

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

    // Save a user to the test db and create new City
    user.save(function () {
      city = {
        name: 'City name'
      };

      done();
    });
  });

  it('should be able to save a City if logged in', function (done) {
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

        // Save a new City
        agent.post('/api/cities')
          .send(city)
          .expect(200)
          .end(function (citySaveErr, citySaveRes) {
            // Handle City save error
            if (citySaveErr) {
              return done(citySaveErr);
            }

            // Get a list of Cities
            agent.get('/api/cities')
              .end(function (citysGetErr, citysGetRes) {
                // Handle City save error
                if (citysGetErr) {
                  return done(citysGetErr);
                }

                // Get Cities list
                var cities = citiesGetRes.body;

                // Set assertions
                (cities[0].user._id).should.equal(userId);
                (cities[0].name).should.match('City name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an City if not logged in', function (done) {
    agent.post('/api/cities')
      .send(city)
      .expect(403)
      .end(function (citySaveErr, citySaveRes) {
        // Call the assertion callback
        done(citySaveErr);
      });
  });

  it('should not be able to save an City if no name is provided', function (done) {
    // Invalidate name field
    city.name = '';

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

        // Save a new City
        agent.post('/api/cities')
          .send(city)
          .expect(400)
          .end(function (citySaveErr, citySaveRes) {
            // Set message assertion
            (citySaveRes.body.message).should.match('Please fill City name');

            // Handle City save error
            done(citySaveErr);
          });
      });
  });

  it('should be able to update an City if signed in', function (done) {
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

        // Save a new City
        agent.post('/api/cities')
          .send(city)
          .expect(200)
          .end(function (citySaveErr, citySaveRes) {
            // Handle City save error
            if (citySaveErr) {
              return done(citySaveErr);
            }

            // Update City name
            city.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing City
            agent.put('/api/cities/' + citySaveRes.body._id)
              .send(city)
              .expect(200)
              .end(function (cityUpdateErr, cityUpdateRes) {
                // Handle City update error
                if (cityUpdateErr) {
                  return done(cityUpdateErr);
                }

                // Set assertions
                (cityUpdateRes.body._id).should.equal(citySaveRes.body._id);
                (cityUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Cities if not signed in', function (done) {
    // Create new City model instance
    var cityObj = new City(city);

    // Save the city
    cityObj.save(function () {
      // Request Cities
      request(app).get('/api/cities')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single City if not signed in', function (done) {
    // Create new City model instance
    var cityObj = new City(city);

    // Save the City
    cityObj.save(function () {
      request(app).get('/api/cities/' + cityObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', city.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single City with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/cities/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'City is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single City which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent City
    request(app).get('/api/cities/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No City with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an City if signed in', function (done) {
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

        // Save a new City
        agent.post('/api/cities')
          .send(city)
          .expect(200)
          .end(function (citySaveErr, citySaveRes) {
            // Handle City save error
            if (citySaveErr) {
              return done(citySaveErr);
            }

            // Delete an existing City
            agent.delete('/api/cities/' + citySaveRes.body._id)
              .send(city)
              .expect(200)
              .end(function (cityDeleteErr, cityDeleteRes) {
                // Handle city error error
                if (cityDeleteErr) {
                  return done(cityDeleteErr);
                }

                // Set assertions
                (cityDeleteRes.body._id).should.equal(citySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an City if not signed in', function (done) {
    // Set City user
    city.user = user;

    // Create new City model instance
    var cityObj = new City(city);

    // Save the City
    cityObj.save(function () {
      // Try deleting City
      request(app).delete('/api/cities/' + cityObj._id)
        .expect(403)
        .end(function (cityDeleteErr, cityDeleteRes) {
          // Set message assertion
          (cityDeleteRes.body.message).should.match('User is not authorized');

          // Handle City error error
          done(cityDeleteErr);
        });

    });
  });

  it('should be able to get a single City that has an orphaned user reference', function (done) {
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

          // Save a new City
          agent.post('/api/cities')
            .send(city)
            .expect(200)
            .end(function (citySaveErr, citySaveRes) {
              // Handle City save error
              if (citySaveErr) {
                return done(citySaveErr);
              }

              // Set assertions on new City
              (citySaveRes.body.name).should.equal(city.name);
              should.exist(citySaveRes.body.user);
              should.equal(citySaveRes.body.user._id, orphanId);

              // force the City to have an orphaned user reference
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

                    // Get the City
                    agent.get('/api/cities/' + citySaveRes.body._id)
                      .expect(200)
                      .end(function (cityInfoErr, cityInfoRes) {
                        // Handle City error
                        if (cityInfoErr) {
                          return done(cityInfoErr);
                        }

                        // Set assertions
                        (cityInfoRes.body._id).should.equal(citySaveRes.body._id);
                        (cityInfoRes.body.name).should.equal(city.name);
                        should.equal(cityInfoRes.body.user, undefined);

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
      City.remove().exec(done);
    });
  });
});
