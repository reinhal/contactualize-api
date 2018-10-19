'use strict';

const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  person_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact'
    // required: true
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

// interactionSchema.pre('find', function(){
//   this.populate('person_id');
// });

module.exports = mongoose.model('Interaction', interactionSchema);