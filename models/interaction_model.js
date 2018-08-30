'use strict';

const interactionSchema = ({
  _id: {
    type: Number,
    required: true, 
    unique: true
  }, 
  person_id: {
    type: Number,
    required: true, 
    unique: true
  }, 
  title: {
    type: String
  }, 
  text: {
    type: String
  }
});

module.exports = {interactionSchema};