const express = require("express");
const modelBinding = require("../middlewares/ModelBinding");
const router = express.Router();

const { Author, Book } = require("../models");

router.get(
  "/",
  modelBinding(Author, "author", "authorId"),
  async (req, res) => {
    try {
      const author = await Author.findByPk(req.author.id, {
        include: [{ model: Book, as: "books" }],
      });

      res.json(author.books);
    } catch (error) {
      res.json({
        message: "Impossible de récupérer les Books de Author",
        error,
      });
    }
  }
);

module.exports = router;
