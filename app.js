const express = require('express');
const cors = require('cors');
const Pool = require('./config.js');
const app = express();
const port = 3003;

const user = require('./user.js');
//const login = require('./login.js');
const product = require('./product.js')
const file = require('./file.js')
const cloths = require('./category.js')
const bodyParser = require('body-parser')
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'))

app.use("/user", user);
app.use(bodyParser.urlencoded({ extended: true }))
//app.use("/user", login);*
//app.use(bodyParser.urlencoded({ extended: true }))
app.use("/product", product);
app.use("/file", file);
app.use("/cloth", cloths);


app.use(bodyParser.urlencoded({ extended: true }))

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

module.exports = Pool;