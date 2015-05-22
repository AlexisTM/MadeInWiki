'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
	mongoose = require('mongoose'),
	Category = mongoose.model('Category'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a category
 */
exports.create = function(req, res) {
	var category = new Category(req.body);
  category.categoryID = category.name.replace(/\W+/g, '_').toLowerCase();
	category.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(category);
		}
	});
};

/**
 * Show the current category
 */
exports.read = function(req, res) {
	res.json(req.category);
};

/**
 * Update a category
 */
exports.update = function(req, res) {
	var category = req.category;

	category.name = req.body.name;
	category.description = req.body.description;

	category.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(category);
		}
	});
};

/**
 * Delete a category
 */
exports.delete = function(req, res) {
	var category = req.category;

	category.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(category);
		}
	});
};

/**
 * List of Categories
 */
exports.list = function(req, res) {
	Category.find().sort('-created').populate('user', 'displayName').exec(function(err, categories) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(categories);
		}
	});
};

/**
 * Category middleware
 */
exports.categoryByID = function(req, res, next, id) {
	Category.findById(id).populate('user', 'displayName').exec(function(err, category) {
		if (err) return next(err);
		if (!category) return next(new Error('Failed to load category ' + id));
		req.category = category;
		next();
	});
};
