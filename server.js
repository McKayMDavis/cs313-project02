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
app.get('/', controller.displayLogin);
//app.get('/header', controller.displayHeader);
app.get('/viz', controller.displayViz);
app.get('/addRows', controller.displayAddRows);
app.get('/addUser', controller.displayAddUser);
app.post('/displayData', controller.displayData);
//app.post('/displayAddRowsTable', controller.displayAddRowsTable);

app.listen(port, () => console.log("Server running"));