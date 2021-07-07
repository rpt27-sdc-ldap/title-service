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

const seedPG = async (numBooks, numParams, numImages) => {

  await client.connect();

  await client.query(schema, (err, res) => {
    if (err) {
      console.log(err);
    }
    return;
  });

  // await client.end();

  let data = await seed(numBooks, numParams, numImages);

  let categories = [];

  // Find all categories
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].categories.length; j++) {
      let category = data[i].categories[j].name;
      if (!categories.includes(category)) {
        categories.push(category);
      }
    }
  }

  // Add all categories to db
  for (let category of categories) {
    console.log(`Inserting category '${category}' into database`);

    await db.Category.create({
      name: category
    });

  }

  // csv

  let file = path.join(__dirname, 'books.csv');
  let booksCategories = path.join(__dirname, 'books_categories.csv');
  let booksCategoriesRows = [];

  let exists = fs.existsSync(file);
  if (exists) {
    fs.unlinkSync(file);
  }

  let keys = Object.keys(data[0]);
  keys.splice(keys.length - 1, 1);
  keys.unshift('id');

  fs.writeFileSync(file, keys.join(',') + '\n');

  booksCategoriesRows.push(['id', 'book_id', 'category_id']);
  for (let i = 0; i < data.length; i++) {
    let row = [];
    let bookId = i + 1;
    row.push(bookId);

    for (let key in data[i]) {
      let column = data[i][key];

      if (key !== 'categories') {
        row.push(column);
      }
    }

    let string = row.join(',');
    if (i !== data.length - 1) {
      string += '\n';
    }
    fs.appendFileSync(file, string);


    for (let key of data[i].categories) {
      let booksCategoriesRow = [];
      let id;
      if (booksCategoriesRows.length === 1) {
        id = 1;
      } else {
        id = booksCategoriesRows[booksCategoriesRows.length - 1][0] + 1;
      }

      booksCategoriesRow.push(id);
      booksCategoriesRow.push(bookId);
      let category = await client.query(`SELECT id FROM categories WHERE name='${key.name}'`);
      if (category.rows.length === 1) {
        booksCategoriesRow.push(category.rows[0].id);
      } else {
        throw 'more than one category found';
      }
      booksCategoriesRows.push(booksCategoriesRow);
    }

    if ((i + 1) % 100000 === 0) {
      console.log(`Writing record ${bookId} to csv`);
    }
  }

  for (let i = 1; i < booksCategoriesRows.length; i++) {

    booksCategoriesRows[i] = booksCategoriesRows[i].join(',');

  }

  // return;

  booksCategoriesRows = booksCategoriesRows.join('\n');
  exists = fs.existsSync(booksCategories);
  if (exists) {
    fs.unlinkSync(booksCategories);
  }

  fs.writeFileSync(booksCategories, booksCategoriesRows);

  await pool.connect((err, client, done) => {
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
    stream.on('finish', () => {
      console.log(`Inserted into books in ${(Date.now() - start) / 1000}s`);
      done();
    });
    fileStream.pipe(stream);
  });

  await pool.connect((err, client, done) => {
    let stream = client.query(copyFrom("COPY books_categories FROM STDIN DELIMITER ',' CSV HEADER"));
    let fileStream = fs.createReadStream(booksCategories);
    fileStream.on('error', () => {
      console.log('fileStream error');
      done();
    });
    stream.on('error', (err) => {
      console.log('stream error', err);
      done();
    });
    stream.on('finish', () => {
      console.log(`Inserted into books_categories ${(Date.now() - start) / 1000}s`);
      done();
    });
    fileStream.pipe(stream);
  });

};

seedPG(10000, 10, 10);