const express = require("express");
const { body } = require("express-validator");
const validate = require("../middlewares/Validate");
const modelBinding = require("../middlewares/ModelBinding");
const router = express.Router();
const bcrypt = require("bcrypt");
const unique = require("../validations/Unique");

const { Author, User, sequelize } = require("../models");

router.get("/", async (req, res) => {
  try {
    const authors = await Author.findAll({
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });
    res.json(authors);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Impossible de récupérer la liste des Authors`, error });
  }
});

router.post(
  "/",
  validate([
    body("firstName").notEmpty().withMessage("Le firstName est requis"),
    body("lastName").notEmpty().withMessage("Le lastName est requis"),
    body("email")
      .notEmpty()
      .withMessage("Le email est requis")
      .isEmail()
      .withMessage("Le email n'est pas valide"),
    body("phoneNumber").notEmpty().withMessage("Le phoneNumber est requis"),
    body("username").notEmpty().withMessage("Le username est requis"),
    body("password")
      .notEmpty()
      .withMessage("Le password est requis")
      .custom((value, { req }) => {
        if (value !== req.body.passwordConfirmation) {
          throw new Error("Password incorrect");
        }

        return true;
      }),
    body("passwordConfirmation")
      .notEmpty()
      .withMessage("Le passwordConfirmation est requis"),
  ]),
  async (req, res, next) => {
    try {
      const data = await sequelize.transaction(async (t) => {
        const encryptedPassword = await bcrypt.hash(req.body.password, 10);

        const user = await User.create(
          {
            username: req.body.username,
            password: encryptedPassword,
          },
          { transaction: t }
        );

        const author = await user.createAuthor(
          {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
          },
          { transaction: t }
        );

        return author;
      });

      res.json(data);
    } catch (error) {
      res.status(500).json({ message: `Impossible de créer le Author`, error });
    }
  }
);

router.get("/:id", modelBinding(Author, "author"), async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.id, {
      include: [{ model: User, as: "user" }],
    });

    res.json(author);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Impossible de récupérer le Author`, error });
  }
});

router.put(
  "/:id",
  validate([
    body("firstName").notEmpty().withMessage("Le firstName est requis"),
    body("lastName").notEmpty().withMessage("Le lastName est requis"),
    body("email")
      .notEmpty()
      .withMessage("Le email est requis")
      .isEmail()
      .withMessage("Le email n'est pas valide")
      .custom((value, { req }) => {
        return unique(value, Author, "email", "id", req.params.id);
      }),
    body("phoneNumber")
      .notEmpty()
      .withMessage("Le phoneNumber est requis")
      .custom((value, { req }) => {
        return unique(value, Author, "phoneNumber", "id", req.params.id);
      }),
    ,
    body("username").notEmpty().withMessage("Le username est requis"),
  ]),
  modelBinding(Author, "author"),
  async (req, res) => {
    const author = req.author;

    try {
      const data = await sequelize.transaction(async (t) => {
        const user = await author.getUser();

        await user.update(
          {
            username: req.body.username,
          },
          { transaction: t }
        );

        await author.update(
          {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
          },
          { transaction: t }
        );

        return author;
      });
      res.json(data);
    } catch (error) {
      res
        .status(500)
        .json({ message: `Impossible de mettre à jour le Author`, error });
    }
  }
);

router.delete("/:id", modelBinding(Author, "author"), async (req, res) => {
  const author = req.author;

  try {
    const data = await sequelize.transaction(async (t) => {
      const user = await author.getUser();

      await author.destroy({ transaction: t });

      await user.destroy({ transaction: t });

      return author;
    });

    res.json(author);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Impossible de supprimer le Author`, error });
  }
});

module.exports = router;
