require('dotenv').config();
const connectionString = process.env.DATABASE_URL;
const { Pool } = require('pg');
const pool = new Pool({connectionString: connectionString});

function pullData (params, callback) {
	var sql = "SELECT * FROM expense";

	pool.query(sql, (err, res) => {
	   if (err) {
	       console.log("Error in query: ")
	       console.log(err);
	   }
	   console.log("Back from DB with result:");
	   callback(res.rows);
	});
}




module.exports = {pullData: pullData};