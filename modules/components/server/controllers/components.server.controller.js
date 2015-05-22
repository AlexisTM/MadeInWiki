'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
	mongoose = require('mongoose'),
	Component = mongoose.model('Component'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a component
 */
exports.create = function(req, res) {
	var component = new Component(req.body);
	component.user = req.user;
  var futureID = component.name + component.reference;
  component.componentID = futureID.replace(/\W+/g, '_');
  component.score = 5;
  component.suppliers = null;
	component.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(component);
		}
	});
};

/**
 * Show the current component
 */
exports.read = function(req, res) {
	res.json(req.component);
};

/**
 * Update a component
 */
exports.update = function(req, res) {
	var component = req.component;
	component.name = req.body.name;
	component.reference = req.body.reference;
  component.description = req.body.description;
  component.categories = req.body.categories;
	component.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(component);
		}
	});
};

/**
 * Delete an component
 */
exports.delete = function(req, res) {
	var component = req.component;

	component.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(component);
		}
	});
};

/**
 * List of Components
 */
exports.list = function(req, res) {
	Component.find().sort('-created').populate('user', 'displayName').exec(function(err, components) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(components);
		}
	});
};

/**
 * Component middleware
 */
exports.componentByID = function(req, res, next, id) {
	Component.findById(id).populate('user', 'displayName').exec(function(err, component) {
		if (err) return next(err);
		if (!component) return next(new Error('Failed to load component ' + id));
		req.component = component;
		next();
	});
};
