'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
	mongoose = require('mongoose'),
	Supplier = mongoose.model('Supplier'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a supplier
 */
exports.create = function(req, res) {
	var supplier = new Supplier(req.body);
	supplier.user = req.user;

	supplier.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(supplier);
		}
	});
};

/**
 * Show the current supplier
 */
exports.read = function(req, res) {
	res.json(req.supplier);
};

/**
 * Update a supplier
 */
exports.update = function(req, res) {
	var supplier = req.supplier;

	supplier.title = req.body.title;
	supplier.content = req.body.content;

	supplier.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(supplier);
		}
	});
};

/**
 * Delete an supplier
 */
exports.delete = function(req, res) {
	var supplier = req.supplier;

	supplier.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(supplier);
		}
	});
};

/**
 * List of Suppliers
 */
exports.list = function(req, res) {
	Supplier.find().sort('-created').populate('user', 'displayName').exec(function(err, suppliers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(suppliers);
		}
	});
};

/**
 * Supplier middleware
 */
exports.supplierByID = function(req, res, next, id) {
	Supplier.findById(id).populate('user', 'displayName').exec(function(err, supplier) {
		if (err) return next(err);
		if (!supplier) return next(new Error('Failed to load supplier ' + id));
		req.supplier = supplier;
		next();
	});
};
