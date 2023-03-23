const express = require('express');
const cors = require('cors');
const Pool = require('./config.js');
const app = express();
const dotenv = require('dotenv');

//const URL = process.env.REACT_APP_BACKEND_URL;
const user = require('./user.js');
//const login = require('./login.js');
const product = require('./product.js')
const file = require('./file.js')
const category = require('./category.js')
const bodyParser = require('body-parser')
dotenv.config({ path: './.env' });
app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'))

app.use("/user", user);
app.use(bodyParser.urlencoded({ extended: true }))
//app.use("/user", login);*
//app.use(bodyParser.urlencoded({ extended: true }))
app.use("/product", product);
app.use("/file", file);
app.use("/category", category);


app.use(bodyParser.urlencoded({ extended: true }))

app.listen(app.get('port'), () => {
  console.log(`App running on port ${app.get('port')}.`);
});

module.exports = Pool;