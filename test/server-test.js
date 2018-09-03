'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const {app} = require('../server');

const should = chai.should();
chai.use(chaiHttp);

describe('API Interactions', function() {

  it('should 200 on GET request', function() {
    return chai.request(app)
      .get('/api/interactions')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
      });
  });

  it('should add a new interaction on POST', function() {
    const newInteraction = {
      person_id: '000000000000000000000003',
      title: 'coding session',
      text: 'worked on debugging application'
    };
    const expectedKeys = ['id'].concat(Object.keys(newInteraction));

    return chai
      .request(app)
      .post('/api/interactions')
      .send(newInteraction)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        (res.body).should.be.a('object');
        (res.body).should.have.all.keys(expectedKeys);
        (res.body.person_id).should.be.equal(newInteraction.person_id);
        (res.body.title).should.be.equal(newInteraction.title);
        (res.body.text).should.be.equal(newInteraction.text);
      });
  });

  it('should update interactions on PUT', function() {
    return (
      chai
        .request(app)
        .get('/api/interactions')
        .then(function(res) {
          const updatedInteraction = Object.assign(res.body[0], {
            person_id: ['111111111111111111111108'],
            title: 'morning coffee meeting',
            text: 'following up on hive activity'
          });
          return chai
            .request(app)
            .put(`/api/interactions/${res.body[0].id}`)
            .send(updatedInteraction)
            .then(function(res) {
              res.should.have.status(200);
            });
        })
    );
  });


  it('should delete interactions on DELETE', function() {
    return (
      chai 
        .request(app)
        .get('/api/interactions')
        .then(function(res) {
          return chai
            .request(app)
            .delete(`/api/interactions/${res.body[0].id}`)
            .then(function(res) {
              (res).should.have.status(204);
            });
        })
    );
  });
});

describe('API Contacts', function() {

  it('should 200 on GET request', function() {
    return chai.request(app)
      .get('/api/contacts')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
      });
  });

  it('should add a contact on POST', function() {
    const newContact = {
      interactions: [ '111111111111111111111118' ],
      person: 'Kari',
      notes: 'needs to clean out the gutters'
    };
    const expectedKeys = ['id'].concat(Object.keys(newContact));

    return chai
      .request(app)
      .post('/api/contacts')
      .send(newContact)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        (res.body).should.be.a('object');
        (res.body).should.have.all.keys(expectedKeys);
        (res.body.interactions).should.be.deep.equal(newContact.interactions);
        (res.body.person).should.be.equal(newContact.person);
        (res.body.notes).should.be.equal(newContact.notes);
      });
  });

  it('should update contacts on PUT', function() {
    return (
      chai
        .request(app)
        .get('/api/contacts')
        .then(function(res) {
          const updatedContact = Object.assign(res.body[0], {
            interactions: ['111111111111111111111117'],
            person: 'Michael',
            notes: 'Is starting a trip to Ghana in a month.'
          });
          return chai
            .request(app)
            .put(`/api/contacts/${res.body[0].id}`)
            .send(updatedContact)
            .then(function(res) {
              res.should.have.status(200);
            });
        })
    );
  });

  it('should delete contacts on DELETE', function() {
    return (
      chai 
        .request(app)
        .get('/api/contacts')
        .then(function(res) {
          return chai
            .request(app)
            .delete(`/api/contacts/${res.body[0].id}`)
            .then(function(res) {
              (res).should.have.status(204);
            });
        })
    );
  });
});