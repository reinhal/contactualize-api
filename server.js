'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const { CLIENT_ORIGIN } = require('./config');
const PORT = process.env.PORT || 8080;

const contactSchema = require('./models/contact_model');
const interactionSchema = require('./models/interactionSchema');

const seedContacts = require('./db/contact.json');
const seedInteractions = require('./db/interactions.json');

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.get('/api/auth', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/interactions', (req, res) => {
  res.json({
    interactions: [
      {
        title: 'Coffee Date',
        text: 'Discussed plans for a trip'
      },
      {
        title: 'Phone Call',
        text: 'Went through ideas for the new website.'
      },
      {
        title: 'Email',
        text: "Followed up on last week's meeing."
      },
      {
        title: 'Dinner Meeting',
        text: 'Asked about the surgery from the day before.'
      }
    ]
  });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = { app };
