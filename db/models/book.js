const { Op } = require('sequelize');
const db = require('../db.js');

module.exports.getById = (id) => {
  return new Promise((resolve, reject) => {
    db.Book.findOne({
      where: {
        id
      },
      include: 'categories'
    })
      .then (result => {
        if (result === null) {
          reject('not found');
        }
        resolve(result);
      })
      .catch(err => {
        reject(err);
      });
  });
};

// Possibly remove this in future
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
    db.Book.findOne({
      where: {
        id
      }
    })
      .then((result) => {
        author = result.author;
        return db.Book.findAll({
          where: {
            [Op.and]: [
              {narrator: result.narrator},
              //don't include results of the same author - so it is only the same narrator
              {author: {[Op.not]: author}},
              //dont include the original book
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
            [Op.and]: [
              {author: author},
              //dont include the original book
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
      });
  });
};

module.exports.add = (book) => {
  console.log(book);
  let categories;
  if (book.categories) {
    categories = book.categories.map((category) => {
      return {name: category};
    });
    delete book.categories;
  }

  return new Promise((resolve, reject) => {
    db.Book.create(book)
      .then((response) => {
        // console.log(response.dataValues.id);

        // if (categories) {
        //   categories.forEach((category) => {
        //     db.sequelize.query('');
        //   });
        // }

        const data = `Successfully added ${response.dataValues.title} by ${response.dataValues.author} with id:${response.dataValues.id}`;
        resolve(data);
      })
      .catch((err) => {
        console.log(err);
        reject(JSON.stringify(err));
      });
  });

};

module.exports.update = (id, book) => {
  if (!id) {
    id = book.id;
  }

  console.log(id, book);

  return new Promise((resolve, reject) => {
    db.Book.update(book, {
      where: {
        id: id
      }
    })
      .then((response) => {
        if (response[0] === 0) {
          throw `no record with id:${book.id} found`;
        }
        resolve(`Updated ${response.length} record`);
      })
      .catch((err) => {
        reject(err);
      });
  });

};

module.exports.delete = (id) => {
  id = Number(id);

  return new Promise((resolve, reject) => {
    db.Book.destroy({
      where: {id}
    })
      .then((response) => {
        if (response === 0) {
          throw `Record with id:${id} not found`;
        } else {
          resolve(`${response} record deleted`);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};