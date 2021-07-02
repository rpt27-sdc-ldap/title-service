const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();
const seed = require('./modularDataGeneration.js').seed;

const sequelize = new Sequelize('audible', process.env.PSQL_DB_USER, process.env.PSQL_DB_PASSWORD, {
  host: process.env.PSQL_DB_HOST,
  dialect: 'postgres',
  logging: false
});