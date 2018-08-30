'use strict';

const contactSchema = ({
  _id: {
    type: Number,
    required: true, 
    unique: true
  }, 
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

module.exports = {contactSchema};