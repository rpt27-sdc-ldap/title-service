const { Op } = require('sequelize');
const db = require('../db.js');

module.exports.getById = (id) => {
  return new Promise((resolve, reject) => {
    db.Book.findAll({
      where: {
        id
      },
      include: 'categories'
    })
    .then (result => {
      resolve(result);
    })
    .catch(err => {
      reject(err);
    })
  });
};

module.exports.getByIds = (ids) => {
  return new Promise((resolve, reject) => {
    db.Book.findAll({
      where: {
        id: {
          [Op.or]: ids
        }
      },
      include: 'categories'
    })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

