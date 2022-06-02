const express = require("express");
const modelBinding = require("../middlewares/ModelBinding");
const validate = require("../middlewares/Validate");
const { Section, Book } = require("../models");
const { body } = require("express-validator");
const { Op } = require("sequelize");

const router = express.Router();

router.get(
  "/",
  modelBinding(Section, "section", "sectionId"),
  async (req, res) => {
    try {
      const section = req.section;

      const books = await section.getBooks();

      res.json(books);
    } catch (error) {
      res.json({
        message: "Impossible de récupérer les Books de Section",
        error,
      });
    }
  }
);

router.post(
  "/",
  validate([
    body("books")
      .notEmpty()
      .withMessage("Le books est requis")
      .isArray()
      .withMessage("books n'est pas une liste"),
    body("books.*").isUUID(4).withMessage("N'est pas valide"),
  ]),
  modelBinding(Section, "section", "sectionId"),
  async (req, res) => {
    try {
      const { books: bookIds } = req.body;

      const section = req.section;

      const books = await Book.findAll({
        where: {
          id: {
            [Op.in]: bookIds,
          },
        },
      });

      await section.setBooks(books);

      res.json(bookIds);
    } catch (error) {
      res.json({
        message: "Impossible de récupérer les Books de Section",
        error,
      });
    }
  }
);

module.exports = router;
