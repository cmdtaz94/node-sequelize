"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Author, {
        through: models.AuthorBook,
        foreignKey: "bookId",
        as: "authors",
      });

      this.belongsTo(models.Section, {foreignKey: "sectionId", as: "section"})
    }
  }
  Book.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      publishedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Book",
    }
  );
  return Book;
};
