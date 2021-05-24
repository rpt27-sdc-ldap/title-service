const db = require('../db/db.js')

module.exports = async () => {
  console.log('closing db');
  await db.sequelize.close();
}