
const pg = require('pg');
require('dotenv').config()
const Pool = new pg.Pool({
    host: process.env.HOST_DATABASE,
    user: process.env.USER_DATABASE,
    port: process.env.PORT_DATABASE,
    password: process.env.PASSWORD_DATABASE,
    database: process.env.DATABASE_NAME
  });

  Pool.connect(function (err) {
    console.log("connection done");
    if (err) {
        console.log("Not Connected");
    }
})

module.exports = Pool;