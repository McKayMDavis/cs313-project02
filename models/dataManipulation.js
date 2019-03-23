require('dotenv').config();
const connectionString = process.env.DATABASE_URL;
const { Pool } = require('pg');
const pool = new Pool({connectionString: connectionString});

function pullData (query, callback) {
	pool.query(query, (err, res) => {
	   if (err) {
	       console.log("Error in query: ")
	       console.log(err);
	   }
	   console.log("Back from DB with result:");
	   callback(res.rows);
	});
}




module.exports = {pullData: pullData};