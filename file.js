//const client = require('./app.js')
const express = require('express')
//const Pool = require('./connection.js');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const folderName='./public';
const fs= require ('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});


const bodyParser = require('body-parser')
router.use(bodyParser.json());

const upload = multer({ storage: storage });

router.get('/', (req, res) => {
    res.send('hello world')
  })
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
  } catch (err) {
    console.error(err);
  }

/*
router.post('/upload', upload.array('file', 4),  function (req, res, next) {
  const dirname = path.resolve();
  console.log('log', req.files);
  let filepath = [];
  req.files.forEach((item) => { filepath.push(item.path) });
  console.log("filepath", filepath);
  if (!req.files) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send({ dirname, filepath });
});*/

router.post('/upload', upload.array('file'), function (req, res, next) {
  const dirname = path.resolve();
  console.log('log', req.files);
  let filepaths = [];
  req.files.forEach((item) => {
    const filepath = req.protocol + '://' + req.headers.host + '/' + item.filename;
    filepaths.push(filepath);
  });
  console.log("filepaths", filepaths);
  if (!req.files) {
    const error = new Error('Please upload a file');
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send({ filepaths });
});
module.exports = router;

//module.exports =Pool;