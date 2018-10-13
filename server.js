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

app.get('/api/interactions/:id', (req, res) => {
  return Interaction.findById(req.params.id)
    .then(function(interaction){
      res.json(interaction);
    });
});

app.post('/api/interactions', jsonParser, (req, res, next) => {
  console.log(req.body);
  const { person_id, title, text } = req.body;
  if (!person_id, !title, !text) {
    const err = new Error(`Missing something`);
    err.status = 400;
    return next(err);
  }
  ///get the json and update contact
  Interaction.create({ person_id, title, text})
    .then(newInteraction => {
      res.status(201)
        .json(newInteraction);
    })
    .catch(next);
});

app.put('/api/interactions/:id', jsonParser, (req, res, next) => {
  const id = req.params.id;
  const updatedInteraction = {};
  const updatedFields = [ 'person_id', 'title', 'text'];
  console.log('request = ' + req.body);
  updatedFields.forEach( field => {
    if (field in req.body) {
      updatedInteraction[field] = req.body[field];
    }
  });
  if (!updatedInteraction.person_id, !updatedFields.title, !updatedInteraction.text) {
    const err = new Error ('Missing some information');
    err.status = 400;
    return next(err);
  }
  Interaction.findByIdAndUpdate(id, updatedInteraction, {new: true})
    .then(interaction => {
      if (interaction) {
        res.json(interaction);
      } else {
        next();
      }
    })
    .catch(next);
});

app.delete('/api/interactions/:id', (req, res, next) => {
  const id = req.params.id;
  Interaction.findByIdAndRemove(id)
    .then(count => {
      if (count) {
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch(next);
});

app.get('/api/contacts', (req, res) => {
  return Contact.find()
    .then(function(contacts){
      res.json(contacts);
    });
});

app.get('/api/contacts/:id', (req, res) => {
  return Contact.findById(req.params.id)
    .then(function(contact){
      res.json(contact);
    });
});

app.post('/api/contacts', jsonParser, (req, res, next) => {
  const { interactions, person, notes } = req.body;

  if (!interactions, !person, !notes) {
    const err = new Error(`Missing something`);
    err.status = 400;
    return next(err);
  }

  Contact.create({ interactions, person, notes })
    .then(newContact => {
      res.status(201)
        .json(newContact);
    })
    .catch(next);
});

app.put('/api/contacts/:id', jsonParser, (req, res, next) => {
  const id = req.params.id;
  const updatedContact = {};
  const updatedFields = [ 'interactions', 'person', 'notes'];
  updatedFields.forEach( field => {
    if (field in req.body) {
      updatedContact[field] = req.body[field];
    }
  });
  if (!updatedContact.interactions, !updatedFields.person, !updatedContact.notes) {
    const err = new Error ('Missing some information');
    err.status = 400;
    return next(err);
  }
  Contact.findByIdAndUpdate(id, updatedContact, {new: true})
    .then(contact => {
      if (contact) {
        res.json(contact);
      } else {
        next();
      }
    })
    .catch(next);
});

app.delete('/api/contacts/:id', (req, res, next) => {
  const id = req.params.id;
  Contact.findByIdAndRemove(id)
    .then(count => {
      if (count) {
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch(next);
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