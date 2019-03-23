const model = require("../models/dataManipulation.js");

// These functions are for displaying pages

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
	model.pullData("SELECT * FROM expense", (rows) => {
		console.log(rows.keys());
		//rows = parseTable(rows);
		res.render("vizWindow.ejs", { data: rows[0] });
	});
}

function displayAddRowsTable(req, res) {
	model.pullData("SELECT attrelid::regclass AS tbl, attname AS col, atttypid::regtype AS datatype\
					FROM pg_attribute\
					WHERE attrelid = 'expense'::regclass\
					AND attnum > 0\
					AND NOT attisdropped\
					ORDER BY attnum", (rows) => {
		console.log(rows);
		res.render("addWindow.ejs", { data: rows[0] });
	});
}





module.exports = {
	displayLogin: displayLogin,
	displayHeader: displayHeader,
	displayViz: displayViz,
	displayAddRows: displayAddRows,
	displayAddUser: displayAddUser,
	displayData: displayData,
	displayAddRowsTable: displayAddRowsTable
};