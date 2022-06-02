"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AuthorBooks", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      authorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Authors",
          key: "id",
        },
      },
      bookId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Books",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("AuthorBooks");
  },
};
