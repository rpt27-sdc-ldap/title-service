const express = require('express');
const app = express();
const cors = require('cors');
const Book = require('../db/models/book.js');
const bodyParser = require('body-parser');
const path = require('path');
const publicPath = path.join(__dirname, '../public');
const expressStaticGzip = require('express-static-gzip');
const compression = require('compression');

const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    return false;
  }
  return compression.filter(req, res);
};

app.use(compression({
  filter: shouldCompress,
  level: 7,
}));

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use('/', expressStaticGzip(publicPath));
// app.use('/', express.static(publicPath));

app.get('/api/book/:id', (req, res) => {
  Book.getById(req.params.id)
    .then((result) => {
      const book = result[0];

      book.dataValues['audioUrl'] = book.dataValues.audio_sample_url;
      book.dataValues['imageUrl'] = book.dataValues.image_url;

      delete book.dataValues.audio_sample_url;
      delete book.dataValues.image_url;
      
      res.send(book);
    })
    .catch((err) => {
      res.status(404);
      console.error('db err: ', err);
      res.send(err);
    });
});

// Possibly remove this in future
app.get('/api/books', (req, res) => {
  //need to convert query sting into array of ids
  const ids = req.query.ids ? req.query.ids.split(',').map(string => parseInt(string)) : req.body.ids;
  Book.getByIds(ids)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500);
      console.error('db err: ', err);
      res.send(err);
    });
});

app.get('/api/book/:id/related', (req, res) => {
  Book.getRelatedById(req.params.id)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500);
      console.error('db err: ', err);
      res.send(err);
    });
});

app.post('/api/book', (req, res) => {

  Book.add(req.body.book)
    .then((response) => {
      res.write(response);
      res.status(200);
      res.send();
    })
    .catch((response) => {
      res.write(response);
      res.status(500);
      res.send();
    });

});

app.put('/api/book/:id', (req, res) => {

  Book.update(req.params.id, req.body.book)
    .then((response) => {
      res.write(response);
      res.status(200);
      res.send();
    })
    .catch((response) => {
      res.write(response);
      res.status(404);
      res.send();
    });

});

app.delete('/api/book/:id', (req, res) => {

  Book.delete(req.params.id)
    .then((response) => {
      res.write(response);
      res.status(200);
      res.send();
    })
    .catch((err) => {
      console.error(err);
      // res.write(err);
      res.status(404);
      res.send();
    });

});

//module is exported for testing
//see start.js for app.listen and port
module.exports = app;