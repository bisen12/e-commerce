
const pg = require('pg');

const Pool = new pg.Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "789456",
    database: "user"
  });

  Pool.connect(function (err) {
    console.log("connection done");
    if (err) {
        console.log("Not Connected");
    }
})

module.exports = Pool;