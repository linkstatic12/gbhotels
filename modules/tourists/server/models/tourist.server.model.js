'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Tourist Schema
 */
var TouristSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Tourist name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Tourist', TouristSchema);
