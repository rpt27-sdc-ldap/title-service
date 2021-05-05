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
      resolve(result[0]);
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

module.exports.getRelatedById = (id) => {
  return new Promise((resolve, reject) => {
    const relatedBy = {
      byNarrator: [],
      byAuthor: []
    };
    let author = '';
    db.Book.findAll({
      where: {
        id
      }
    })
    .then((result) => {
      author = result[0].author;
      return db.Book.findAll({
        where: {
          [Op.and] : [
            {narrator: result[0].narrator},
            {author: {[Op.not]: author}},
            {id: {[Op.not]: id}}
          ]
        },
        include: 'categories'
      });
    })
    .then((result) => {
      relatedBy.byNarrator = result;
      return db.Book.findAll({
        where: {
          [Op.and] : [
            {author: author},
            {id: {[Op.not]: id}}
          ]
        },
        include: 'categories'
      });
    })
    .then((result) => {
      relatedBy.byAuthor = result;
      resolve(relatedBy);
    })
    .catch((err) => {
      reject(err);
    })
  });
};

