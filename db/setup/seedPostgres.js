require('dotenv').config();
const seed = require('./modularDataGeneration.js').seed;
const db = require('../db.js');
const start = Date.now();
const fs = require('fs');
const path = require('path');
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), {encoding: 'utf8'});
const { Client, Pool } = require('pg');
const client = new Client();
const pool = new Pool();
const copyFrom = require('pg-copy-streams').from;
let scriptDone = false;

setInterval(() => {
  if (!scriptDone) {
    console.log(`Memory usage at ${(Date.now() - start) / 1000} seconds - ${Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100} MB`);
  } else {
    console.log('Script complete - Press ctrl + c to end');
  }
}, 5000);

const seedPG = async (numBooks, numParams, numImages) => {

  await client.connect();

  await client.query(schema, (err, res) => {
    if (err) {
      console.error(err);
    }
  });

  let file = await seed(numBooks, numParams, numImages);

  await pool.connect(async (err, client, done) => {
    console.log('Copying from CSV to books table');
    let stream = client.query(copyFrom("COPY books FROM STDIN DELIMITER ',' CSV HEADER"));
    let fileStream = fs.createReadStream(file);
    fileStream.on('error', () => {
      console.error('fileStream error');
      done();
    });
    stream.on('error', (err) => {
      console.error('stream error', err);
      done();
    });
    stream.on('finish', async () => {
      console.log(`Inserted into books at ${(Date.now() - start) / 1000}s`);

      console.log('inserting into categories');
      await client.query('INSERT INTO categories(name) SELECT category1 FROM books UNION SELECT category2 FROM books');
      console.log(`inserted into categories at ${(Date.now() - start) / 1000}s`);

      console.log('inserting category1 into books_categories');
      await client.query('INSERT INTO books_categories (book_id, category_id) SELECT a.id,b.id FROM books a LEFT JOIN categories b ON (a.category1 = b.name)');
      console.log(`inserted category1 into books_categories at ${(Date.now() - start) / 1000}s`);

      console.log('inserting category2 into books_categories');
      await client.query('INSERT INTO books_categories (book_id, category_id) SELECT a.id,b.id FROM books a LEFT JOIN categories b ON (a.category2 = b.name)');
      console.log(`inserted category2 into books_categories at ${(Date.now() - start) / 1000}s`);

      console.log('dropping columns "category1" and "category2"');
      await client.query('ALTER TABLE books DROP COLUMN category1, DROP COLUMN category2');

      console.log('setting correct next value on primary key');
      await client.query("SELECT setval(pg_get_serial_sequence('books', 'id'), (SELECT MAX(id) FROM books)+1)");

      console.log('clustering data');
      await client.query('CLUSTER books_categories USING books_categories_category_id_index');
      await client.query('CLUSTER categories USING categories_id_index');
      console.log('done');
      scriptDone = true;
      done();

    });
    fileStream.pipe(stream);
  });

};

seedPG(10000000, 1000, false);