const mysql = require("mysql2"); //connection to mysql2
const db = mysql.createConnection({
  host: "localhost", //database is located where?? this computer
  user: "root", //admin
  password: "#172@Evah_321", //my password
  database: "HSTORE" //database name
});

db.connect((err) => { //test to see if the db works😝
  if (err) {
    console.log("❌ Database connection failed");
    console.log(err);
  } else {
    console.log("✅ Database connected successfully");
  }
});

module.exports = db;