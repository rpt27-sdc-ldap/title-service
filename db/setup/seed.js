// const { Sequelize } = require('sequelize');
const data = require('./data.json');
const db = require('../db.js');

db.sequelize.sync({ force: true })
  .then(() => {
    console.log('table creation succesful');
    return db.Book.bulkCreate(data, {include: 'categories'});
  })
  .then ((result) => {
    console.log('database seeded successfully');
    return db.sequelize.close();
  })
  .catch((err) => {
    console.log('**ERROR: ', err);
    return db.sequelize.close();
  });
