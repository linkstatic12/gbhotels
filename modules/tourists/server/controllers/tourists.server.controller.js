'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Tourist = mongoose.model('Tourist'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Tourist
 */
exports.create = function(req, res) {
  var tourist = new Tourist(req.body);
  tourist.user = req.user;

  tourist.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tourist);
    }
  });
};

/**
 * Show the current Tourist
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var tourist = req.tourist ? req.tourist.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  tourist.isCurrentUserOwner = req.user && tourist.user && tourist.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(tourist);
};

/**
 * Update a Tourist
 */
exports.update = function(req, res) {
  var tourist = req.tourist ;

  tourist = _.extend(tourist , req.body);

  tourist.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tourist);
    }
  });
};

/**
 * Delete an Tourist
 */
exports.delete = function(req, res) {
  var tourist = req.tourist ;

  tourist.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tourist);
    }
  });
};

/**
 * List of Tourists
 */
exports.list = function(req, res) { 
  Tourist.find().sort('-created').populate('user', 'displayName').exec(function(err, tourists) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tourists);
    }
  });
};

/**
 * Tourist middleware
 */
exports.touristByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Tourist is invalid'
    });
  }

  Tourist.findById(id).populate('user', 'displayName').exec(function (err, tourist) {
    if (err) {
      return next(err);
    } else if (!tourist) {
      return res.status(404).send({
        message: 'No Tourist with that identifier has been found'
      });
    }
    req.tourist = tourist;
    next();
  });
};
