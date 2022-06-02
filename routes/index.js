module.exports = (app) => {
  app.get("/", function (req, res) {
    res.json({ message: `Bienvenue sur ${process.env.APP_NAME}` });
  });

  app.use("/api/authors", require("../controllers/AuthorController"));

  app.use(
    "/api/authors/:authorId/books",
    (req, res, next) => {
      req.authorId = req.params.authorId;
      next();
    },
    require("../controllers/AuthorBookController")
  );

  app.use("/api/books", require("../controllers/BookController"));

  app.use("/api/sections", require("../controllers/SectionController"));

  app.use(
    "/api/sections/:sectionId/books",
    (req, res, next) => {
      req.sectionId = req.params.sectionId;
      next();
    },
    require("../controllers/SectionBookController")
  );

  app.use(
    "/api/users/:id/avatar",
    (req, res, next) => {
      req.id = req.params.id;
      next();
    },
    require("../controllers/UserAvatarController")
  );

  app.use(({ res }) => {
    const message = `Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL`;
    res.status(404).json({ message });
  });
};
