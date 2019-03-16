const model = require("../models/dataManipulation.js");

function displayHome(req, res) {
	res.sendFile('./public/index.html');
}

function displayData(req, res) {
	model.pullData();
}





module.exports = {
	displayHome: displayHome,
	displayData: displayData
};