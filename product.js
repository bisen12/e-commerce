const express = require('express');
const router = express.Router();

const app = express();
const pg = require('pg');

const Pool = new pg.Pool({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "789456",
  database: "user"
});




router.get('/', (req, res) => {
 
    Pool.query('SELECT * from products', (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send(`Error fetching user with ID ${id}`);  
        }
        else{
            res.send(result)
        }
    })
})


router.get('/:id', (req, res) => {
    const id = req.params.id;
    Pool.query('SELECT * from products WHERE id = $1', [id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send(`Error fetching user with ID ${id}`);
      } else if (result.rows.length === 0) {
        res.status(404).send(`User with ID ${id} not found`);
      } else {
        res.send(result.rows[0]);
      }
    });
  });

  

  const bodyParser = require('body-parser')
  router.use(bodyParser.json());
  router.post('/', (req, res)=> {
    
    const user = req.body;
    console.log(req.body); 
    let insertQuery = `insert into products(id, name, price, image,quantity) 
                       values(${user?.id}, '${user.name}', ${user.price}, '${user.image}',${user.quantity})`
    Pool.query(insertQuery, (err, result)=>{
        if(!err){
            res.send('Insertion was successful')
        }
        else{ console.log(err.message) }
    })
    
})

    // client.end()


   router.put('/:id', (req, res)=> {
    console.log(req);
    let user = req.body;
    const id= req.params.id
    let updateQuery = `update products
                       set name = '${user.name}',
                       price = ${user.price},
                       image = '${user.image}',
                       quantity=${user.quantity}
                       where id = ${req.params.id}`

    Pool.query(updateQuery, (err, result)=>{
        if(!err){
            res.send('Update was successful')
        }
        else{ console.log(err.message) }
    })
    Pool.end;
})



router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Pool.query('DELETE FROM products WHERE id = $1', [id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send(`Error deleting user with ID ${id}`);
      } else if (result.rowCount === 0) {
        res.status(404).send(`User with ID ${id} not found`);
      } else {
        res.send(`User with ID ${id} deleted successfully`);
      }
    });
  });
module.exports = router;

