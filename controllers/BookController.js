const express = require("express");
const { body } = require("express-validator");
const validate = require("../middlewares/Validate");
const modelBinding = require("../middlewares/ModelBinding");
const { Author, Book, sequelize, User } = require("../models");
const { Op } = require("sequelize");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const books = await Book.findAll({
      include: [
        {
          model: Author,
          as: "authors",
        },
      ],
    });
    res.json(books);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Impossible de récupérer la liste des Books`, error });
  }
});

router.post(
  "/",
  validate([
    body("name").notEmpty().withMessage("Le name est requis"),
    body("publishedAt")
      .notEmpty()
      .withMessage("Le publishedAt est requis")
      .isDate()
      .withMessage("N'est pas une date valide"),
    body("authors")
      .notEmpty()
      .withMessage("Le authors est requis")
      .isArray()
      .withMessage("Doit être une liste"),
    body("authors.*").isUUID(4).withMessage("N'est pas un UUIDv4 valide"),
  ]),
  async (req, res) => {
    const { name, publishedAt, authors: authorIDs } = req.body;

    try {
      const authors = await Author.findAll({
        where: {
          id: {
            [Op.in]: authorIDs,
          },
        },
      });

      const data = await sequelize.transaction(async (t) => {
        const book = await Book.create(
          { name, publishedAt },
          { transaction: t }
        );

        await book.setAuthors(authors, { transaction: t });

        return book;
      });

      res.json(data);
    } catch (error) {
      res.status(500).json({ message: `Impossible de créer le Book`, error });
    }
  }
);

router.get("/:id", modelBinding(Book, "book"), async (req, res) => {
  try {
    const book = await Book.findByPk(req.book.id, {
      include: [
        {
          model: Author,
          as: "authors",
          include: {
            model: User,
            as: "user",
          },
        },
      ],
    });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Impossible de récupérer le Book", error });
  }
});

router.put(
  "/:id",
  validate([
    body("name").notEmpty().withMessage("Le name est requis"),
    body("publishedAt")
      .notEmpty()
      .withMessage("Le publishedAt est requis")
      .isDate()
      .withMessage("N'est pas une date valide"),
    body("authors")
      .notEmpty()
      .withMessage("Le authors est requis")
      .isArray()
      .withMessage("Doit être une liste"),
    body("authors.*").isUUID(4).withMessage("N'est pas un UUIDv4 valide"),
  ]),
  modelBinding(Book, "book"),
  async (req, res) => {
    const { name, publishedAt, authors: authorIDs } = req.body;
    const book = req.book;

    try {
      const authors = await Author.findAll({
        where: {
          id: {
            [Op.in]: authorIDs,
          },
        },
      });

      await sequelize.transaction(async (t) => {
        await book.update({ name, publishedAt }, { transaction: t });

        await book.setAuthors(authors, { transaction: t });

        return book;
      });

      res.json(req.body);
    } catch (error) {
      res
        .status(500)
        .json({ message: `Impossible de mettre à jour le Book`, error });
    }
  }
);

router.delete("/:id", modelBinding(Book, "book"), async (req, res) => {
  const book = req.book;
  try {
    await sequelize.transaction(async (t) => {
      const authors = await book.getAuthors();
      
      await book.removeAuthors(authors, { transaction: t });

      await book.destroy({ transaction: t });
    });

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Impossible de supprimer le Book", error });
  }
});

module.exports = router;
