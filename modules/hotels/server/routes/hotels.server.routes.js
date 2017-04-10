'use strict';

/**
 * Module dependencies
 */
var hotelsPolicy = require('../policies/hotels.server.policy'),
  hotels = require('../controllers/hotels.server.controller');

module.exports = function(app) {
  // Hotels Routes
  app.route('/api/hotels')
    .get(hotels.list)
    .post(hotels.create);

  app.route('/api/hotels/:hotelId').all(hotelsPolicy.isAllowed)
    .get(hotels.read)
    .put(hotels.update)
    .delete(hotels.delete);

  // Finish by binding the Hotel middleware
  app.param('hotelId', hotels.hotelByID);
};
