'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Hotel Schema
 */
var HotelSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Hotel name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  city:{
type: Schema.ObjectId,
ref: 'City'

  },
  longtitude:{
type:Number,
default:0

  },
  img:{type:String,default:'',trim:true},
  latitude:{
    type:Number,
    default:0
  },
  description:{
    type:String,
    default:'',
    trim: true
  },
  total_rooms:{
    type:Number,
    default:10
  },
  Address:
  {
    type:String,
    default:'',
    trim:true
  },
  Phone:{type:String,
    default:'',
    trim:true}



});

mongoose.model('Hotel', HotelSchema);
