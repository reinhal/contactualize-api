'use strict';

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  interactions: {
    type: Array,
    required: true
  }, 
  person: {
    type: String
  }, 
  notes: {
    type: String
  }
});

contactSchema.set('toObject', {
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Contact', contactSchema);