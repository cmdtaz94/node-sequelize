const express = require("express");
const { body } = require("express-validator");
const validate = require("../middlewares/Validate");
const modelBinding = require("../middlewares/ModelBinding");
const { Section } = require("../models");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const sections = await Section.findAll();
    res.json(sections);
  } catch (error) {
    res.status(500).json({
      message: `Impossible de récupérer la liste des Sections`,
      error,
    });
  }
});

router.post(
  "/",
  validate([body("name").notEmpty().withMessage("Le name est requis")]),
  async (req, res) => {
    try {
      const { name } = req.body;
      const section = await Section.create({ name });
      res.json(section);
    } catch (error) {
      res.status(500).json({
        message: `Impossible de récupérer la Section`,
        error,
      });
    }
  }
);

router.get("/:id", modelBinding(Section, "section"), async (req, res) => {
  res.json(req.section);
});

router.put(
  "/:id",
  validate([body("name").notEmpty().withMessage("Le name est requis")]),
  modelBinding(Section, "section"),
  async (req, res) => {
    try {
      const { name } = req.body;

      const section = req.section;

      await section.update({ name });

      res.json(section);
    } catch (error) {
      res.status(500).json({
        message: `Impossible de mettre à jour la Section`,
        error,
      });
    }
  }
);

router.delete("/:id", modelBinding(Section, "section"), async (req, res) => {
  try {
    const section = req.section;

    const books = await section.getBooks();

    if (books.length > 0) {
      return res
        .status(400)
        .json(
          `Impossible de supprimer la Section. Il contient un ou plusieurs livres`
        );
    }

    await section.destroy();

    res.json(section);
  } catch (error) {
    res.status(500).json({
      message: `Impossible de supprimer la Section`,
      error,
    });
  }
});

module.exports = router;
