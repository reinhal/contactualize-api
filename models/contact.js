'use strict';

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  interactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interaction'
    // required: true
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
// interactions.length for preview
// changing number out for the detailed interactions
// population
contactSchema.pre('find', function(){
  this.populate('interactions');
});
module.exports = mongoose.model('Contact', contactSchema);