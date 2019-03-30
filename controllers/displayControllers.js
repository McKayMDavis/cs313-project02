const model = require("../models/dataManipulation.js");

// These functions are for displaying pages

// We could either put a condition in here to redirect to the viz page if logged in or we could make viz html for a two page app
function displayLogin(req, res) {
	res.sendFile(path.join(__dirname, './public/index.html'));
}

function displayHeader(req, res) {
	res.render('header.ejs');
}

function displayViz(req, res) {
	res.render('viz.ejs');
}

function displayAddRows(req, res) {
	res.render('addRows.ejs');
}

function displayAddUser(req, res) {
	res.render('addUser.ejs');
}



// These functions are for handling data requests for display purposes

function displayData(req, res) {
	var table = req.body.dtype;
	var year = req.body.year;
	var query = "SELECT expense_id, description, vendor, amount, year, date_entered, last_update FROM " + table + " WHERE year = '" + year + "'";

	var sql = "SELECT expense_id, description, vendor, amount, year, date_entered, last_update FROM $1 WHERE year = $2";
	var params = [table, year];

	model.pullData(query, (rows) => {
		console.log(rows.keys());
		//rows = parseTable(rows);
		//res.render("vizWindow.ejs", { data: rows[0] });
		res.json(rows);
	});
}

function displayAddRowsTable(req, res) {
	var query = "SELECT attrelid::regclass AS tbl, attname AS col, atttypid::regtype AS datatype\
					FROM pg_attribute\
					WHERE attrelid = 'expense'::regclass\
					AND attnum > 0\
					AND NOT attisdropped\
					ORDER BY attnum";

	model.pullData(query, (rows) => {
		console.log(rows);
		res.render("addWindow.ejs", { data: rows[0] });
	});
}



// Handle login
function login(req, res) {
	var user = req.body.username;
	var pass = req.body.password;
	var query = "SELECT user_id, username, password, user_type FROM users WHERE username = '" + user + "';";

	model.pullData(query, (rows) => {
		if (rows[0]) {
			console.log("Password found: Setting session var");
			req.session.uid = rows[0].user_id;
			console.log(req.session.uid);
			res.render('viz.ejs');
		} else {
			//do nothing
		}
	});
}

function logout(req, res) {
	req.session.destroy();
	console.log("Session destroyed");
	res.redirect('back');
}



module.exports = {
	displayLogin: displayLogin,
	displayHeader: displayHeader,
	displayViz: displayViz,
	displayAddRows: displayAddRows,
	displayAddUser: displayAddUser,
	displayData: displayData,
	displayAddRowsTable: displayAddRowsTable,
	login: login,
	logout: logout
};