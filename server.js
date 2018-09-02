'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { CLIENT_ORIGIN, MONGODB_URI } = require('./config');
const PORT = process.env.PORT || 8080;

const Contact = require('./models/contact');
const Interaction = require('./models/interaction');
const jsonParser = bodyParser.json();

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

app.post('/api/interactions', jsonParser, (req, res) => {
  const requiredFields = ['person_id', 'title', 'text'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const interaction = Interaction.create(req.body.person_id, req.body.title, req.body.text);
  res.status(201).json(interaction);
});

app.get('/api/contacts', (req, res) => {
  return Contact.find()
    .then(function(contacts){
      res.json(contacts);
    });
});

app.post('/api/contacts', jsonParser, (req, res) => {
  const requiredFields = ['interactions', 'person', 'notes'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const contact = Contact.create(req.body.interactions, req.body.person, req.body.notes);
  res.status(201).json(contact);
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