const controller = require("./controllers/displayControllers.js");

const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

/***********
Web Services
***********/
app.get('/', controller.displayHome);
app.post('/displayData', controller.displayData);

app.listen(port, () => console.log("Server running"));