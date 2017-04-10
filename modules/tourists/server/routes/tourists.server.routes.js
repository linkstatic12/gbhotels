'use strict';

/**
 * Module dependencies
 */
var touristsPolicy = require('../policies/tourists.server.policy'),
  tourists = require('../controllers/tourists.server.controller');

module.exports = function(app) {
  // Tourists Routes
  app.route('/api/tourists').all(touristsPolicy.isAllowed)
    .get(tourists.list)
    .post(tourists.create);

  app.route('/api/tourists/:touristId').all(touristsPolicy.isAllowed)
    .get(tourists.read)
    .put(tourists.update)
    .delete(tourists.delete);

  // Finish by binding the Tourist middleware
  app.param('touristId', tourists.touristByID);
};
