const cmd = require('node-cmd');

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

function plotR(command, callback) {
	cmd.get(
        command,
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
	json2table: json2table,
	json2formTable: json2formTable,
	plotR: plotR,
	tablePlot: tablePlot
}