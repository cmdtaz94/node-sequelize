const express = require("express");
const modelBinding = require("../middlewares/ModelBinding");
const { User } = require("../models");
const path = require("path");
const { body } = require("express-validator");
const nodemailer = require("nodemailer");

const router = express.Router();

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(process.cwd(), "uploads", "avatars"));
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}-${req.user.id}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
});

router.post(
  "/",
  modelBinding(User, "user"),
  upload.single("avatar"),
  async (req, res) => {
    try {
      const user = req.user;

      await user.update({ avatar: req.file.path });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "nazonhoumailer@gmail.com",
          pass: "alnjvarpuvmshfnb",
        },
      });

      const message = {
        from: "AZONHOU <nazonhoumailer@gmail.com>",
        to: "cmdtazonhou@gmail.com",
        subject: `The subject goes here`,
        html: `The body of the email goes here in HTML`,
        attachments: [
          {
            filename: `${req.file.originalname}`,
            path: req.file.path,
          },
        ],
      };

      transporter.sendMail(message, function (err, info) {
        if (err) {
          return res
            .status(500)
            .json({ message: `Impossible d'envoyer le mail`, error: err });
        }
        res.json(`Avatar upload avec succès`);
      });
    } catch (error) {
      res.json({
        message: "Impossible de récupérer les Books de Author",
        error,
      });
    }
  }
);

module.exports = router;
