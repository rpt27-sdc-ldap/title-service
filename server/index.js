const express  = require('express');
const app = express();
const cors = require('cors');
const Book = require('../db/models/book.js');

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.get('/api/book/:id', (req, res) => {
  Book.getById(req.params.id)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500);
      console.log('db err: ', err);
      res.send(err);
    });
});

app.get('/api/books', (req, res) => {
  //need to convert query sting into array of ids
    const ids = req.query.ids ? req.query.ids.split(',').map(string => parseInt(string)) : req.body.ids;
  Book.getByIds(ids)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500);
      console.log('db err: ', err);
      res.send(err);
    })
});

app.get('/api/book/:id/related', (req, res) => {
  Book.getRelatedById(req.params.id)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500);
      console.log('db err: ', err);
      res.send(err);
    });
});

//module is exported for testing
//see start.js for app.listen and port
module.exports = app;