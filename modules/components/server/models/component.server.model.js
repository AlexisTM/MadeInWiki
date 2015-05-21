'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Component Schema
 */
var ComponentSchema = new Schema({
  name : {
    type: String,
    required : 'Please enter a name',
    trim: true
  },
	componentID: {
		type: String,
		default: '',
		trim: true,
    unique : true,
		required: 'ID is not unique... duplicated name and reference!'
	},
  reference: {
    type: String,
    required : 'The reference is required',
    default: '',
    trim: true
  },
  suppliers: [{
    type: Schema.ObjectId,
    ref : 'Supplier'
  }],
  categories: [{
    type: Schema.ObjectId,
    ref: 'Category'
  }],
  images: [{
    type: String
  }],
  score : {
    type: Number,
    default : 5
  }
});

mongoose.model('Component', ComponentSchema);
