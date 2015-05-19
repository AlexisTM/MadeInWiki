'use strict';

/**
 * Module dependencies.
 */
var componentsPolicy = require('../policies/components.server.policy'),
	components = require('../controllers/components.server.controller');

module.exports = function(app) {
	// Articles collection routes
	app.route('/api/components').all(componentsPolicy.isAllowed)
		.get(components.list)
		.post(components.create);

	// Single component routes
	app.route('/api/components/:componentId').all(componentsPolicy.isAllowed)
		.get(components.read)
		.put(components.update)
		.delete(components.delete);

	// Finish by binding the component middleware
	app.param('componentId', components.componentByID);
};
