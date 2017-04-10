'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  City = mongoose.model('City'),
  Hotel = mongoose.model('Hotel'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a City
 */
exports.create = function(req, res) {
  var city = new City(req.body);
  city.user = req.user;

  city.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(city);
    }
  });
};

/**
 * Show the current City
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var city = req.city ? req.city.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  city.isCurrentUserOwner = req.user && city.user && city.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(city);
};

/**
 * Update a City
 */
exports.update = function(req, res) {
  var city = req.city ;

  city = _.extend(city , req.body);

  city.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(city);
    }
  });
};

/**
 * Delete an City
 */
exports.delete = function(req, res) {
  var city = req.city ;

  city.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(city);
    }
  });
};

/**
 * List of Cities
 */
exports.list = function(req, res) { 
  City.find().sort('-created').populate('user', 'displayName').exec(function(err, cities) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cities);
    }
  });
};

/**
 * City middleware
 */
exports.cityByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'City is invalid'
    });
  }

  City.findById(id).populate('user', 'displayName').exec(function (err, city) {
    if (err) {
      return next(err);
    } else if (!city) {
      return res.status(404).send({
        message: 'No City with that identifier has been found'
      });
    }
    req.city = city;
    next();
  });
};


/**
 * List of hotels for a city
 */

 exports.listOfHotelByCity = function(req,res)

 {

  console.log("HEC");
console.log(req.body.name);

City.findOne({ name: req.body.name}).exec(function(err,city){

console.log(city);
Hotel.find({city:city}).exec(function(err,hotels){
  console.log(hotels.length);
  res.jsonp({hotels:hotels,totalnumber:hotels.length});





});  
});


 }