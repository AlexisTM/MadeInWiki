'use strict';

/**
 * Module dependencies.
 */
var suppliersPolicy = require('../policies/suppliers.server.policy'),
	suppliers = require('../controllers/suppliers.server.controller');

module.exports = function(app) {
	// Suppliers collection routes
	app.route('/api/suppliers').all(suppliersPolicy.isAllowed)
		.get(suppliers.list)
		.post(suppliers.create);

	// Single supplier routes
	app.route('/api/suppliers/:supplierId').all(suppliersPolicy.isAllowed)
		.get(suppliers.read)
		.put(suppliers.update)
		.delete(suppliers.delete);

	// Finish by binding the supplier middleware
	app.param('supplierId', suppliers.supplierByID);
};
