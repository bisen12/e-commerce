const express = require('express');
const router = express.Router();
//const app = express();
const pg = require('pg');

const Pool = new pg.Pool({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "789456",
  database: "user"

});

/*
router.get('/us', (req, res) => {
    Pool.query('SELECT * FROM users', (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send(`Error fetching user with ID ${id}`);
        }
        else{
            res.send(result)
        }
    })
})

*/
const bodyParser = require('body-parser')
  router.use(bodyParser.json());
  

router.post('/register', async (req, res) => {
    const { first_name,last_name,mobile_no,email_id,user_id,password } = req.body;
    try {
      const result = await Pool.query('INSERT INTO users (first_name,last_name,mobile_no,email_id,user_id,password) VALUES ($1, $2,$3,$4,$5,$6) RETURNING first_name', [first_name,last_name,mobile_no,email_id,user_id,password]);
      
      const name = result.rows[0].first_name;
      res.status(201).json({ success: true, name });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'An error occurred while registering the user' });
    }
  });


  router.post('/login', async (req, res) => {
    console.log(req.body);
    const { user_id, password } = req.body;
    try {
      const result = await Pool.query('SELECT * FROM users WHERE user_id = $1 AND password = $2', [user_id, password]);
      console.log(`SELECT * FROM users WHERE user_id ="${user_id}" AND password ="${password}"`);
      // const result = await Pool.query(`SELECT * FROM users WHERE user_id =${user_id} AND password =${password}`);
      if (result.rows.length === 0) {
        res.status(401).json({ success: false, message: 'Invalid user_id or password' });
      } else {
        const first_name = result.rows[0].first_name;
        
        const last_name = result.rows[0].last_name;
        const mobile_no = result.rows[0].mobile_no;
  
        const email_id = result.rows[0].email_id;
        res.status(200).json({ success: true, first_name,last_name,mobile_no ,email_id });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'An error occurred while logging in' });
    }
  });
  

module.exports = router;