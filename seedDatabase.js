'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const {MONGODB_URI} = require('./config');

const Contact = require('./models/contact');
const Interaction = require('./models/interaction');
const Users = require('./users/model');

const contactData = require('./db/contacts');
const interactionData = require('./db/interactions');
const userData = require('./db/users');

mongoose.connect(MONGODB_URI)
  .then(function(){
    return mongoose.connection.db.dropDatabase();
  }).then(() => {
    return Promise.all(userData.map( user => bcrypt.hash(user.password, 10)));
  })
  .then(function(digests){
    userData.forEach((user, i) => user.password = digests[i]);
    return Promise.all([
      Users.insertMany(userData),
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