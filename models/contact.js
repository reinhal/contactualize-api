'use strict';

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interaction'
  }],
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

contactSchema.pre('find', function(){
  this.populate('interactions');
});

module.exports = mongoose.model('Contact', contactSchema);

//object has a key of interactions which points to the array of interaction 
// IDs belonging to that person, find the ID of the interaction that was just 
// deleted and remove it from that array of interactions