const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();
const seed = require('./modularDataGeneration.js').seed;
const db = require('../db.js');
const start = Date.now();

const sequelize = new Sequelize('audible', process.env.PSQL_DB_USER, process.env.PSQL_DB_PASSWORD, {
  host: process.env.PSQL_DB_HOST,
  dialect: 'postgres',
  logging: false
});

const seedPG = async () => {

  let data = await seed(100000, 10, 10);
  
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


  let promises = [];

  let i = 1;
  let j = 1;
  for (let record of data) {
    if (i % 100 === 0) {
      console.log(`${i} records saved to Postgres. ${(Date.now() - start) / 1000}s elapsed`);
    }
    let promise = new Promise((resolve, reject) => {
      db.Book.create(record)
        .then((result) => {
          if (j % 100 === 0) {
            console.log('j', j, `${(Date.now() - start) / 1000}s elapsed`);
          }
          j++;
          resolve();
        })
        .catch((err) => {
          console.log(err);
          reject();
        });
    });
  
    promises.push(promise);
    i++;
  }

  await Promise.all(promises);

  console.log(`done in ${(Date.now() - start) / 1000}s`);
  return;
};

seedPG();