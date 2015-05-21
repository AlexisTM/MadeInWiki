'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Human editor / creator
 */
var HumanSchema = new Schema( {
  fullName: String,
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    default: Date.now
  }
} );

/**
 * Component Schema
 */
var ComponentSchema = new Schema({
  created : [HumanSchema],
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
		required: 'ID'
	},
  reference: {
    type: String,
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
