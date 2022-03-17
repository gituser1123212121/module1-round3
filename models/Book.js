module.exports = (sequelize, Sequelize) => {
  const DataTypes = Sequelize.DataTypes;
  const Book = sequelize.define('Book', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false
    },
    publishedOn: {
      type: DataTypes.STRING,
      defaultValue: ""
    },
    addedOn: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
  return Book;
};
