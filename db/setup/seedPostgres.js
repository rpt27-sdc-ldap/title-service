const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();
const seed = require('./modularDataGeneration.js').seed;
const db = require('../db.js');
const start = Date.now();
const fs = require('fs');
const path = require('path');
const asyncJS = require('async')

const sequelize = new Sequelize('audible', process.env.PSQL_DB_USER, process.env.PSQL_DB_PASSWORD, {
  host: process.env.PSQL_DB_HOST,
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 1000
  }
});

const seedPG = async () => {

  let data = await seed(100, 10, 1);
  
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

  let file = path.join(__dirname, 'data.csv');

  let exists = fs.existsSync(file);
  if (exists) {
    fs.unlinkSync(file);
  }

  let keys = Object.keys(data[0]);
  keys.splice(keys.length - 1, 1);
  keys.unshift('id');

  fs.writeFileSync(file, keys.join(',') + '\n');

  for (let i = 0; i < data.length; i++) {
    let row = [];
    row.push(i + 1);

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
    if ((i + 1) % 100000 === 0) {
      console.log(i + 1);
    }
  }

  console.log(`Done in ${(Date.now() - start) / 1000}s`);
};

seedPG();