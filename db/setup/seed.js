const { Sequelize, DataTypes } = require('sequelize');
const data = require('./data.json');

const sequelize = new Sequelize('audible', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(() => {
    console.log('connection to db successful');
  })
  .catch((err) => {
    console.log('connection err: ', err);
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
  backgroundColor: {
    type: DataTypes.STRING(7)
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
    type: DataTypes.STRING
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
    refrences: {
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
    refrences: {
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

sequelize.sync({ force: true })
  .then(() => {
    console.log('table creation succesful');
    return Book.create({
      title: data[0].title,
      subtitle: data[0].subtitle,
      author: data[0].author,
      narrator: data[0].narrator,
      imageUrl: data[0].imageUrl,
      audioSampleUrl: data[0].audioSampleUrl,
      length: data[0].length,
      version: data[0].version,
      categories: [
        {name: 'one'},
        {name: 'two'}
      ]
    },
    {
    include: 'categories'
    })
  })
  .then (response => {
    console.log('success: ', response);
    return sequelize.close();
  })
  .catch((err) => {
    console.log('**ERROR: ', err);
    return sequelize.close();
  });
