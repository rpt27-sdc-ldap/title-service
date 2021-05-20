const data = require('./data.json');
const db = require('../db.js');

//ensures that order is retained which is
//important for testing
data.forEach((book, index) => {
  book.id = index + 1;
});

const insertCategories= () => {
  return new Promise((resolve, reject) => {
    data.forEach((book, index) => {
      book.categories.forEach((category, i) => {
        db.Category.upsert(category, {returning: true})
          .then((result) => {
            if (index === data.length - 1 && i === 1) {
              resolve(data);
            }
          })
          .catch((err) => {
            reject(err);
          })
      })
    });
  })
}

const setCategoryIds = () => {
  return new Promise((resolve, reject) => {
    data.forEach((book, index) => {
      book.categories.forEach((category, i) => {
        db.Category.findOne({where: {name: category.name}})
          .then((result) => {
            data[index].categories[i].id = result.id;
            if (index === data.length - 1 && i === 1) {
              resolve(data);
            }
          })
          .catch((err) => {
            reject(err);
          })
      })
    })
  })
}

const addCategoriesToBook = (bookId, categories) => {
  return new Promise((resolve, reject) => {
    categories.forEach((category, index) => {
      db.BookCategory.create({book_id: bookId, category_id: category.id})
        .then(() => {
          if (index === categories.length - 1) {
            resolve();
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
}

const bulkAddBooksAndSetCategories = () => {
  return new Promise((resolve, reject) => {
    data.forEach((book, index) => {
      db.Book.create(book)
      .then((entry) => {
        return addCategoriesToBook(entry.id, book.categories);
      })
      .then(() => {
        if (index === data.length - 1) {
          resolve();
        }
      })
      .catch((err) => {
        reject(err);
      })
    })
  });
}

const seedDatabase = () => {
  return new Promise((resolve, reject) => {
    db.sequelize.sync({force: true})
      .then(() => {
        return insertCategories();
      })
      .then(() => {
        return setCategoryIds();
      })
      .then(() => {
        return bulkAddBooksAndSetCategories();
      })
      .then(() => {
        console.log('database seeded successfully');
        //db.sequelize.close();
        resolve();
      })
      .catch((err) => {
        console.log('DATABASE ERR: ', err);
        //db.sequelize.close();
        reject();
      })
  });
}

module.exports.seedDatabase = seedDatabase;