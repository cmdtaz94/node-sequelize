"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AuthorBook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AuthorBook.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      authorId: { type: DataTypes.UUID, allowNull: false },
      bookId: { type: DataTypes.UUID, allowNull: false },
    },
    {
      sequelize,
      modelName: "AuthorBook",
    }
  );
  return AuthorBook;
};
