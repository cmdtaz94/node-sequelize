const express = require("express");
const app = express();
require("dotenv").config();

app.use(express.json());

require("./routes")(app);

app.listen(process.env.APP_PORT, () => {
  console.log(
    `${process.env.APP_NAME} tourne sur l'adresse http://localhost:${process.env.APP_PORT}`
  );
});
