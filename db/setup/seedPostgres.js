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
const EventEmitter = require('events');

setInterval(() => {
  console.log(`${Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100} MB`);
}, 5000);

const seedCategories = async (rows) => {
  console.log('seedCategories');

  let categories = [];
  let booksCategories = [];
  rows.forEach((row) => {
    let split = row.categories.split(',');

    for (let i = 0; i < split.length; i++) {
      if (!categories.includes(split[i])) {
        categories.push(split[i]);
      }

      booksCategories.push({
        id: row.id,
        category: split[i]
      });
    }

  });

  await pool.connect(async (err, client, done) => {
    console.log('inserting categories')

    categories.forEach(async (category) => {

      const query = {
        name: 'insert-categories',
        text: 'INSERT INTO categories(name) VALUES($1)',
        values: [category]
      };

      await client.query(query);
    });

    const booksCategoriesPath = path.join(__dirname, 'books_categories.csv');
    const exists = fs.existsSync(booksCategoriesPath);
    if (exists) {
      fs.unlinkSync(booksCategoriesPath);
    }
    await fs.appendFileSync(booksCategoriesPath, 'id,book_id,category_id\n');

    let counter = 0;
    const myEmitter = new EventEmitter();
    myEmitter.on('done', () => {
      console.log('copying from csv into books_categories');

      let stream = client.query(copyFrom("COPY books_categories FROM STDIN DELIMITER ',' CSV HEADER"));
      let fileStream = fs.createReadStream(booksCategoriesPath);
      fileStream.on('error', () => {
        console.log('fileStream error');
        done();
      });
      stream.on('error', (err) => {
        console.log('stream error', err);
        done();
      });
      stream.on('finish', async () => {
        console.log(`Inserted into books_categories in ${(Date.now() - start) / 1000}s`);
        done();
      });
      fileStream.pipe(stream);

    });
    let categoryRows;

    await client.query('SELECT * from categories', (err, result) => {
      console.log('getting inserted categoires');
      categoryRows = result.rows;

      booksCategories.forEach((row, idx) => {
        let categoryId;

        for (let i = 0; i < categoryRows.length; i++) {
          if (categoryRows[i].name === row.category) {
            categoryId = categoryRows[i].id;
          }
        }

        let string = idx + ',' + row.id + ',' + categoryId + '\n';
        fs.appendFile(booksCategoriesPath, string, (err, result) => {
          if (err) {
            console.log(err);
          }
          counter++;
          if (counter === booksCategories.length) {
            myEmitter.emit('done');
          }
        });

      });
    });


  });


};

const seedPG = async (numBooks, numParams, numImages) => {

  await client.connect();

  await client.query(schema, (err, res) => {
    if (err) {
      console.log(err);
    }
    return;
  });

  let file = await seed(numBooks, numParams, numImages);

  let rows;

  await pool.connect(async (err, client, done) => {
    console.log('Copying from CSV to books table');
    let stream = client.query(copyFrom("COPY books FROM STDIN DELIMITER ',' CSV HEADER"));
    let fileStream = fs.createReadStream(file);
    fileStream.on('error', () => {
      console.log('fileStream error');
      done();
    });
    stream.on('error', (err) => {
      console.log('stream error', err);
      done();
    });
    stream.on('finish', async () => {
      console.log(`Inserted into books in ${(Date.now() - start) / 1000}s`);

      const query = {
        name: 'get-categories',
        text: 'SELECT id,categories FROM books'
      };

      client.query(query, async (err, result) => {
        await done();
        await seedCategories(result.rows);
      });

    });
    fileStream.pipe(stream);
  });

};

seedPG(10000000, 10, 10);