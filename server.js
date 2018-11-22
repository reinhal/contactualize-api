'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const { CLIENT_ORIGIN, MONGODB_URI } = require('./config');
const PORT = process.env.PORT || 8080;

const Contact = require('./models/contact');
const Interaction = require('./models/interaction');
const jsonParser = bodyParser.json();

const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

mongoose.Promise = global.Promise;

app.use(morgan('common'));

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.use(function (req, res, next) {
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'rosebud'
  });
});

app.get('/api/auth', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/interactions', jwtAuth, (req, res) => {
  Interaction.find({userId:req.user.id})
    .populate('person_id')
    .then(function(interactions){
      res.json(interactions);
    });
});

app.get('/api/interactions/:id', jwtAuth, (req, res) => {
  Interaction.findById(req.params.id)
    .then(function(interaction){
      res.json(interaction);
    });
});

app.post('/api/interactions', [jsonParser, jwtAuth],(req, res, next) => {
  const userId = req.user.id;
  const { person_id, title, text } = req.body;
  if (!person_id, !title, !text) {
    const err = new Error(`Missing something`);
    err.status = 400;
    return next(err);
  }
  Interaction.create({ userId, person_id, title, text})
    .then(newInteraction => {
      Contact.findOne({_id:person_id},function(err,contact){
        if(!err){
          contact.interactions.push(newInteraction._id);
          contact.save();
          res.status(201).json(newInteraction);
        }
      });
    })
    .catch(next);
});

app.put('/api/interactions/:id', [jsonParser, jwtAuth],(req, res, next) => {
  const id = req.params.id;
  const userId = req.user.id;
  const updatedInteraction = {};
  const updatedFields = [ 'person_id', 'title', 'text'];
  updatedFields.forEach( field => {
    if (field in req.body) {
      updatedInteraction[field] = req.body[field];
    }
  });
  updatedInteraction.userId = userId;
  if (!updatedInteraction.person_id, !updatedFields.title, !updatedInteraction.text) {
    const err = new Error ('Missing some information');
    err.status = 400;
    return next(err);
  }
  Interaction.findByIdAndUpdate(id, updatedInteraction)
    .then(interaction => {
      Contact.findOne({_id:updatedInteraction.person_id},function(err,contact){
        if(!err){
          contact.interactions.push(interaction._id);
          contact.save();
          res.status(201).json(interaction);
        }
      });
    })
    .catch(next);
});

app.delete('/api/interactions/:id', jwtAuth, (req, res, next) => {
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

app.get('/api/contacts', jwtAuth, (req, res) => {
  Contact.find({userId:req.user.id})
    .then(function(contacts){
      res.json(contacts);
    });
});

app.get('/api/contacts/:id', jwtAuth, (req, res) => {
  console.log('RES',res.body);
  Contact.findById(req.params.id)
    .then(function(contact){
      res.json(contact);
    });
});

app.post('/api/contacts', [jsonParser, jwtAuth], (req, res, next) => {
  const userId = req.user.id;
  const { person, notes } = req.body;
  if (!userId || !person || !notes) {
    const err = new Error(`Missing something`);
    //make this error message more specific
    err.status = 400;
    return next(err);
  }

  Contact.create({ userId, person, notes })
    .then(newContact => {
      res.status(201)
        .json(newContact);
    })
    .catch(next);
});

app.put('/api/contacts/:id', [jsonParser, jwtAuth], (req, res, next) => {
  const id = req.params.id;
  const userId = req.user.id;
  const updatedContact = {};
  const updatedFields = [ 'person', 'notes'];
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
  Contact.findByIdAndUpdate(id, updatedContact, userId, {new: true})
    .then(contact => {
      Contact.findOne({id}, function(err,contact){
        if(!err){
          contact.push(id);
          contact.save();
          res.status(201).json(interaction);
        }
      })
      // if (contact) {
      //   res.json(contact);
      // } else {
      //   next();
      // }
    })
    .catch(next);
});

app.delete('/api/contacts/:id', jwtAuth, (req, res, next) => {
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

app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

let server;

function runServer(databaseUrl, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(MONGODB_URI).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };