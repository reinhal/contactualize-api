'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const { CLIENT_ORIGIN, MONGODB_URI } = require('./config');
const PORT = process.env.PORT || 8080;

const Contact = require('./models/contact');
const Interaction = require('./models/interaction');

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.get('/api/auth', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/interactions', (req, res) => {
  return Interaction.find()
    .then(function(interactions){
      res.json(interactions);
    });
});

app.get('/api/contacts', (req, res) => {
  return Contact.find()
    .then(function(contacts){
      res.json(contacts);
    });
});

mongoose.connect(MONGODB_URI)
  .then(instance => {
    const conn = instance.connections[0];
    console.info(`Connected to: mongodb://${conn.host}:${conn.port}/${conn.name}`);
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error('\n === Did you remember to start `mongod`? === \n');
    console.error(err);
  });
    
app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});

module.exports = { app };