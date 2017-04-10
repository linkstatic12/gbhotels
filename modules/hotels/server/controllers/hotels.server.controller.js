'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Hotel = mongoose.model('Hotel'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Hotel
 */
exports.create = function(req, res) {
  var hotel = new Hotel(req.body);
  hotel.user = req.user;

  hotel.save(function(err) {
    if (err) {
      console.log(err);
      return res.status(400).send({

        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(hotel);
    }
  });
};

/**
 * Show the current Hotel
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var hotel = req.hotel ? req.hotel.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  hotel.isCurrentUserOwner = req.user && hotel.user && hotel.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(hotel);
};

/**
 * Update a Hotel
 */
exports.update = function(req, res) {
  var hotel = req.hotel ;

  hotel = _.extend(hotel , req.body);

  hotel.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(hotel);
    }
  });
};

/**
 * Delete an Hotel
 */
exports.delete = function(req, res) {
  var hotel = req.hotel ;

  hotel.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(hotel);
    }
  });
};

/**
 * List of Hotels
 */
exports.list = function(req, res) { 
  Hotel.find().sort('-created').populate('user', 'displayName').exec(function(err, hotels) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(hotels);
    }
  });
};

/**
 * Hotel middleware
 */
exports.hotelByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Hotel is invalid'
    });
  }

  Hotel.findById(id).populate('user', 'displayName').exec(function (err, hotel) {
    if (err) {
      return next(err);
    } else if (!hotel) {
      return res.status(404).send({
        message: 'No Hotel with that identifier has been found'
      });
    }
    req.hotel = hotel;
    next();
  });
};
