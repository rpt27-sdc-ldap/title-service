const express  = require('express');
const app = express();
const cors = require('cors');
const Book = require('../db/models/book.js');
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

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

app.post('/api/book', (req, res) => {

  Book.add(req.body.book)
    .then((response) => {
      res.status(200);
      res.send(response + '\n');
    })
    .catch((response) => {
      res.write(response + '\n');
      res.status(400);
      res.send();
    })

});

app.put('/api/book', (req, res) => {

  Book.update(req.body.book)
    .then((response) => {
      res.status(200);
      res.send(response + '\n');
    })
    .catch((response) => {
      res.write(response + '\n');
      res.status(404);
      res.send();
    })

});

app.delete('/api/book/:id', (req, res) => {

  Book.delete(req.params.id)
    .then((response) => {
      res.status(200)
      res.send(response);
    })
    .catch((err) => {
      res.status(404);
      res.send(err + '\n');
    })

})

//module is exported for testing
//see start.js for app.listen and port
module.exports = app;