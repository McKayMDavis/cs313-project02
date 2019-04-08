const model = require("../models/dataManipulation.js");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const fastcsv = require('fast-csv');
const fs = require('fs');
const ws = fs.createWriteStream('./public/temp.csv');
const cmd = require('node-cmd');

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
	var tab = req.body.dtype;
	var year = req.body.year;
	if (tab == 'expense') {
		var query = {
			text: 'SELECT expense_id, description, vendor, amount, year, date_entered, last_update FROM expense WHERE year = $1',
			values: [year]
		}
	} else if (tab == 'revenue') {
		var query = {
			text: 'SELECT expense_id, description, vendor, amount, year, date_entered, last_update FROM revenue WHERE year = $1',
			values: [year]
		}
	}

	model.pullData(query, (rows) => {
		console.log(rows);
		fastcsv
			.write(rows, { headers: true })
			.pipe(ws);
		var table = json2table(rows, 'table table-bordered');
		plotR('./public/temp.csv', (plot) => {
			var output = tablePlot(table, plot);
			res.send(output);
		});
	});
}

function displayAddRowsTable(req, res) {
	var tab = req.body.dtype;
	var nrow = req.body.nrow;
	var query = {
		text: 'SELECT attname AS col FROM pg_attribute WHERE attrelid = $1::regclass AND attnum > 0 AND NOT attisdropped ORDER BY attnum',
		values: [tab]
	}

	model.pullData(query, (rows) => {
		req.session.nrow = nrow;
		req.session.dtype = tab;
		var table = json2formTable(rows, nrow, 'table table-bordered');
		res.send(table);
	});
}



// Handle login
function login(req, res) {
	var user = req.body.username;
	var pass = req.body.password;

	var query = {
		text: 'SELECT user_id, username, password, user_type FROM users WHERE username = $1;',
		values: [user]
	}

	model.pullData(query, (rows) => {
		if (rows[0]) {
			bcrypt.compare(pass, rows[0].password, function(err, res2) {
				if (res2) {
					req.session.uid = rows[0].user_id;
					req.session.utype = rows[0].user_type;
					res.render('viz.ejs');
				} else {
					console.log("Password incorrect");
				}
			});
		} else {
			console.log("Username not found");
		}
	});
}

function logout(req, res) {
	req.session.destroy();
	console.log("Session destroyed");
	res.redirect('back');
}


// Put data
//NEED TO DO SOMETHING IF SUCCESSFUL FOR BOTH OF THESE
function putUser(req, res) {
	var user = req.body.username;
	var pass = req.body.password;
	var date = new Date().toISOString().slice(0, 10);
	var last = req.session.uid;
	if (req.body.usertype == 'Admin') {
		var userType = 1;
	} else if (req.body.usertype == 'User') {
		var userType = 2;
	}

	bcrypt.hash(pass, saltRounds, function(err, hash) {
		var query = {
			text: 'INSERT INTO users(username, password, user_type, date_entered, last_update) VALUES ($1, $2, $3, $4, $5)',
			values: [user, hash, userType, date, last]
		}

		model.pullData(query, (rows) => {
			console.log(rows);
		});
	});
}

function putRows(req, res) {
	var dat = req.body.dat;
	var nrow = req.session.nrow;
	var tab = req.session.dtype;

	var date = new Date().toISOString().slice(0, 10);
	var last = req.session.uid;
	var goal_id = 1;

	if (tab == "expense") {
		console.log("Adding data to expense table");
		for (i = 0; i < nrow; i++) {
			var description = dat[i][0];
			var vendor = dat[i][1];
			var amount = dat[i][2];
			var year = dat[i][3];
			var query = {
				text: 'INSERT INTO expense(description, vendor, amount, year, date_entered, last_update, goal_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
				values: [description, vendor, amount, year, date, last, goal_id]
			}
			model.pullData(query, (rows) => {
				console.log(rows);
			});
		}
	} else if (tab == "revenue") {
		console.log("Adding data to revenue table");
		for (i = 0; i < nrow; i++) {
			var description = dat[i][0];
			var client = dat[i][1];
			var amount = dat[i][2];
			var year = dat[i][3];
			var query = {
				text: 'INSERT INTO revenue(description, client, amount, year, date_entered, last_update, goal_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
				values: [description, client, amount, year, date, last, goal_id]
			}
			model.pullData(query, (rows) => {
				console.log(rows);
			});
		}
	}
}


// UTILS SPLIT THIS OUT INTO ANOTHER FILE
function json2table(json, classes) {
	var cols = Object.keys(json[0]);
	var headerRow = '';
	var bodyRows = '';
	classes = classes || '';

	cols.map(function(col) {
		headerRow += '<th>' + capitalizeFirstLetter(col) + '</th>';
	});

	json.map(function(row) {
		bodyRows += '<tr>';

		cols.map(function(colName) {
			bodyRows += '<td>' + row[colName] + '</td>';
		});

		bodyRows += '</tr>';
	});

	return '<table class="' +
		classes +
		'"><thead><tr>' +
		headerRow +
		'</tr></thead><tbody>' +
		bodyRows +
		'</tbody></table>';
}

function json2formTable(json, nrow, classes) {
	var cols = Object.keys(json[0]);
	var headerRow = '';
	var bodyRows = '';
	classes = classes || '';

	json.map(function(row) {
		cols.map(function(colName) {
			if (!row[colName].includes('id') && !row[colName].includes('last_update') && !row[colName].includes('date_entered')) {
				headerRow += '<th>' + capitalizeFirstLetter(row[colName]) + '</th>';
			}
		});
	});

	for (i = 0; i < nrow; i++) {
		bodyRows += '<tr>';
		for (j = 0; j < 4; j++) {
			bodyRows += '<td><input type="text" name="dat[' + i + '][' + j + ']"></td>';
		}
		bodyRows += '</tr>';
	}

	return '<form id="enter" action="/putRows" method="POST" autocomplete="off">' +
		'<table class="' +
		classes +
		'"><thead><tr>' +
		headerRow +
		'</tr></thead><tbody>' +
		bodyRows +
		'</tbody></table>' +
		'<input type="submit" value="Add Rows"></form>';
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function plotR(path, callback) {
	cmd.get(
        'Rscript ./public/plots.R',
        function(err, data, stderr){
            callback("<img src='temp.png' alt='Plot Image' style='width:100%;'></img>");
        }
    );
}

function tablePlot(table, plot) {
	return "<ul class='nav nav-tabs'>\
						<li class='active'><a data-toggle='tab' href='#data'>Table</a></li>\
						<li><a data-toggle='tab' href='#plot'>Visual</a></li>\
					</ul>\
					<div class='tab-content'>\
						<div id='data' class='tab-pane fade in active'>" +
							table +
						"</div>\
						<div id='plot' class='tab-pane fade'>" +
							plot +
						"</div>\
					</div>";
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
	logout: logout,
	putUser: putUser,
	putRows: putRows
};