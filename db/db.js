const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('audible', process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false
});


const Book = sequelize.define('Book', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subtitle: {
    type: DataTypes.STRING
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  narrator: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING
  },
  audioSampleUrl: {
    type: DataTypes.STRING
  },
  length: {
    type: DataTypes.STRING(10)
  },
  version: {
    type: DataTypes.STRING
  }
});

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    unique: true
  }
});

const Book_Category = sequelize.define('Book_Category', {
  id: {
    type: DataTypes.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  book_id: {
    type: DataTypes.INTEGER(11),
    primaryKey: false,
    unique: true,
    references: {
      model: Book,
      key: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  },
  category_id: {
    type: DataTypes.INTEGER(11),
    primaryKey: false,
    unique: true,
    references: {
      model: Category,
      key: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }
}, {
  timestamps: false,
  freezeTableName: true
});


Book.belongsToMany(Category, {
  through: Book_Category,
  as: 'categories',
  foreignKey: 'book_id'
});

Category.belongsToMany(Book, {
  through: Book_Category,
  as: 'books',
  foreignKey: 'category_id'
});

module.exports.sequelize = sequelize;
module.exports.Book = Book;
module.exports.Category = Category;
module.exports.BookCategory = Book_Category;