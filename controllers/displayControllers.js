const model = require("../models/dataManipulation.js");

function displayHome(req, res) {
	res.sendFile('./public/index.html');
}

function displayData(req, res) {
	model.pullData("something", (rows) => {
		console.log(rows.keys());
		//rows = parseTable(rows);
		res.render("vizWindow.ejs", { data: rows[0] });
	});
}





module.exports = {
	displayHome: displayHome,
	displayData: displayData
};