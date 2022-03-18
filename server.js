const express = require("express");
const app = express();
const db = require("./models");
const PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");

//BodyParsing
app.use(bodyParser.json());

db.sequelize
  .sync({ force: true })
  .then(() => {
    console.log("tables dropped and recreated");
  })
  .catch((err) => {
    console.log(err.message);
  });

require("./routes/auth.route")(app);
require("./routes/book.route")(app);

app.listen(PORT, console.log("Server has started at port " + PORT));
