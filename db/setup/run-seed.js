const db = require('../db.js');
const seed = require('./seed.js');

seed.seedDatabase()
  .then(() => {
    db.sequelize.close();
  });