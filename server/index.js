const express  = require('express');
const app = express();
const port = 1001;

const Book = require('../db/models/book.js');

app.use(express.static('public'));

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

app.listen(port, () => {
  console.log(`Audible title service listening at http://localhost:${port}`);
});