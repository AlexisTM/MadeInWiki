'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Category Schema
 */
var CategorySchema = new Schema({
	categoryID: {
    type: String,
    required: 'ID is not unique or not given',
    unique: true,
    trim: true,
    default: ''
  },
	name: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	description: {
		type: String,
		default: '',
		trim: true
	}
});

mongoose.model('Category', CategorySchema);
