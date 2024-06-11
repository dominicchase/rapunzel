require("dotenv/config");

const express = require("express");
const app = express();

app.use(express.json());

const routes = ["games"];

routes.forEach((route) => {
  const path = require(`./routes/${route}`);
  app.use(`/api/${route}`, path);
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
