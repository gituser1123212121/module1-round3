const express = require("express");
const app = express();
const db = require("./models");
const PORT = process.env.PORT || 8080;


//BodyParsing
app.use(express.urlencoded({ extended: false }));


db.sequelize.sync({force:true}).then(()=>{
    console.log("table dropped and recreated");
}).catch(err=>{
    console.log(err.message);
});

require("./routes/auth.route")(app);

app.listen(PORT, console.log("Server has started at port " + PORT));
