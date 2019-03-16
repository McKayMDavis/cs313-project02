require('dotenv').config();
const connectionString = process.env.DATABASE_URL;
const { Pool } = require('pg');
const pool = new Pool({connectionString: connectionString});

function pullData (params) {
	var sql = "SELECT * FROM revenue";

	pool.query(sql, (err, res) => {
	   // If an error occurred...
	   if (err) {
	       console.log("Error in query: ")
	       console.log(err);
	   }

	   // Log this to the console for debugging purposes.
	   console.log("Back from DB with result:");
	   console.log(res.rows);
	});
}




module.exports = {pullData: pullData};