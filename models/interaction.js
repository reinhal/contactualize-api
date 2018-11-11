'use strict';

const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  person_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact'
    // required: true
  }, 
  person: {
    type: String
  },
  title: {
    type: String
  }, 
  text: {
    type: String
  }
});

interactionSchema.set('toObject', {
  transform(doc, ret) {
    ret.id = ret._id; //normalizing the property of id
    delete ret._id;  // don't need this id
    delete ret.__v; 
  }
});

module.exports = mongoose.model('Interaction', interactionSchema);