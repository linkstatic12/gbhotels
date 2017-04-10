'use strict';

/**
 * Module dependencies
 */
var citiesPolicy = require('../policies/cities.server.policy'),
  cities = require('../controllers/cities.server.controller');

module.exports = function(app) {
  // Cities Routes
  app.route('/api/cities')
    .get(cities.list)
    .post(cities.create);
app.route('/api/cities/listOfHotels').post(cities.listOfHotelByCity);
  app.route('/api/cities/:cityId').all(citiesPolicy.isAllowed)
    .get(cities.read)
    .put(cities.update)
    .delete(cities.delete);



  // Finish by binding the City middleware
  app.param('cityId', cities.cityByID);

};
