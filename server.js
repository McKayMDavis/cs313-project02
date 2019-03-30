const controller = require("./controllers/displayControllers.js");

const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

const session = require('express-session');
app.use(session({
	secret: 'uid-session',
	resave: false,
	saveUninitialized: true
}));

app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

/**********************
Login Check Middleware
**********************/
function checkLogin(req, res, next) {
	if (req.session.uid) {
		next();
	} else {
		res.status(401).json({success: false, message: 'User not authorized.'});
	}
}

/***********
Web Services
***********/
app.post('/login', controller.login);
app.get('/logout', controller.logout);


app.get('/', checkLogin, controller.displayLogin);
//app.get('/header', controller.displayHeader);
app.get('/viz', checkLogin, controller.displayViz);
app.get('/addRows', checkLogin, controller.displayAddRows);
app.get('/addUser', checkLogin, controller.displayAddUser);
app.post('/displayData', checkLogin, controller.displayData);
//app.post('/displayAddRowsTable', controller.displayAddRowsTable);

app.listen(port, () => console.log("Server running"));