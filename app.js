const express = require('express');
const app = express();
const port = 3003;
const user = require('./user.js');
//const login = require('./login.js');
const product = require('./product.js')
const file =require('./file.js')
const bodyParser = require('body-parser')
app.use(bodyParser.json());


app.use("/user", user);
app.use(bodyParser.urlencoded({ extended: true }))
//app.use("/user", login);
//app.use(bodyParser.urlencoded({ extended: true }))
app.use("/product",product);
//app.use("/file",file);
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

