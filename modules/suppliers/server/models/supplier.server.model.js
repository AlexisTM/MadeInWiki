'use strict';

/**
 * Module dependencies.
 */
var mongoose = require( 'mongoose' ),
  Schema = mongoose.Schema;

/**
 * Human Schema
 */
var ComponentPriceSchema = new Schema( {
  components: {
    type: Schema.ObjectId,
    ref: 'Component'
  },
  price: Number,
  score: {
    type: Number,
    default : 5
  }
} );

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
 * Supplier Schema
 */
var SupplierSchema = new Schema( {
  name: {
    type: String,
    required: true,
    trim: true,
    default: ''
  },
  supplierID: {
    type: String,
    required: 'ID is not unique or not given',
    unique: true,
    trim: true,
    default: ''
  },
  country: {
    type: String,
    default: '',
    trim: true,
    required: 'Please enter a country'
  },
  city: {
    type: String,
    default: '',
    trim: true
  },
  address: {
    type: String,
    default: '',
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  score: {
    type: Number,
    default: 5
  },
  created: [ HumanSchema ],
  components: [ ComponentPriceSchema ]
} );

mongoose.model( 'Supplier', SupplierSchema );
mongoose.model( 'ComponentPrice', ComponentPriceSchema );
