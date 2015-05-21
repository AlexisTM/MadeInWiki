'use strict';

/**
 * Module dependencies.
 */
var mongoose = require( 'mongoose' ),
  Schema = mongoose.Schema;

/**
 * File Schema
 */
var FileSchema = new Schema( {
  title: {
    type: String,
    required: 'Give a title to your file',
    default: '',
    trim: true
  },
  path: {
    type: String,
    required: 'Is the file here?',
    default: ''
  },
  description: String
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
 * Article Schema
 */
var ArticleSchema = new Schema( {
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  abstract: {
    type: String,
    default: '',
    trim: true
  },
  articleID: {
    type: String,
    default: '',
    trim: true,
    unique: true,
    required: 'ID is not unique or not given',
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  components: [ {
    type: Schema.ObjectId,
    ref: 'Component'
  } ],
  langages: [ {
    type: String,
    default: '',
    trim: true
  } ],
  lang : String,
  //files: [ FileSchema ],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  created: {
    type:Date,
    default: Date.now
  }//,
  //edited: [ HumanSchema ]
} );

mongoose.model( 'File', FileSchema );
mongoose.model( 'Article', ArticleSchema );
