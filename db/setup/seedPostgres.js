const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();
const seed = require('./modularDataGeneration.js').seed;
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize('audible', process.env.PSQL_DB_USER, process.env.PSQL_DB_PASSWORD, {
  host: process.env.PSQL_DB_HOST,
  dialect: 'postgres',
  logging: false
});

const writeToCSV = async () => {

  let data = await seed();
  let categories = [];

  for (let i = 0; i < data.length; i++) {
    let array = [];

    for (let key in data[i]) {

      if (typeof data[i][key] === 'object') {



        for (let category in data[i][key]) {
          array.push(data[i][key][category].name);
          if (!categories.includes(data[i][key][category].name)) {
            categories.push(data[i][key][category].name);
          }
        }



      } else {
        array.push(data[i][key]);
      }

    }

    if (i % Math.floor((i / 100)) === 0) {
      console.log(`${i} records recorded`);
    }

  }
};

writeToCSV();