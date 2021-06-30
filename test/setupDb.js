const seed = require('../db/setup/seed.js');

module.exports = async () => {
  await seed.seedDatabase();
};