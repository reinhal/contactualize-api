'use strict';

const mongoose = require('mongoose');
const {MONGODB_URI} = require('./config');

const Contact = require('./models/contact');
const Interaction = require('./models/interaction');

const contactData = require('./db/contacts');
const interactionData = require('./db/interactions');

mongoose.connect(MONGODB_URI)
  .then(function(){
    mongoose.connection.db.dropDatabase();
  })
  .then(function(){
    return Promise.all([
      Contact.insertMany(contactData), 
      Interaction.insertMany(interactionData)
    ]);  
  })
  .then(function(){
    mongoose.disconnect();
  })
  .catch(function(err){
    console.error('Oops!');
    console.error(err.message);
  });