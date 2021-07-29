const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('audible', process.env.PSQL_DB_USER, process.env.PSQL_DB_PASSWORD, {
  host: process.env.PSQL_DB_HOST,
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false
});


const Book = sequelize.define('books', {
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
  image_url: {
    type: DataTypes.STRING
  },
  audio_sample_url: {
    type: DataTypes.STRING
  },
  length: {
    type: DataTypes.STRING(10)
  },
  version: {
    type: DataTypes.STRING
  }
}, {
  timestamps: false
});

const Category = sequelize.define('categories', {
  name: {
    type: DataTypes.STRING,
    unique: true
  }
}, {
  timestamps: false
});

const Book_Category = sequelize.define('books_categories', {
  id: {
    type: DataTypes.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  category_id: {
    type: DataTypes.INTEGER(11),
    primaryKey: false,
    unique: true,
    references: {
      model: Category,
      key: 'category_id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  },
  book_id: {
    type: DataTypes.INTEGER(11),
    primaryKey: false,
    unique: true,
    references: {
      model: Book,
      key: 'book_id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  }
}, {
  timestamps: false,
  freezeTableName: true,
  tableName: 'books_categories'
}, {
  timestamps: false
});


Book.belongsToMany(Category, {
  through: Book_Category,
  as: 'categories',
  foreignKey: {name: 'book_id', allowNull: false},
  onDelete: 'cascade',
  onUpdate: 'cascade'
});


Category.belongsToMany(Book, {
  through: Book_Category,
  as: 'books',
  foreignKey: {name: 'category_id', allowNull: false},
  onDelete: 'cascade',
  onUpdate: 'cascade'
});

module.exports.sequelize = sequelize;
module.exports.Book = Book;
module.exports.Category = Category;
module.exports.Book_Category = Book_Category;