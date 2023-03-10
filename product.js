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




router.get('/', async(req, res) => {
 
   /* Pool.query('SELECT * from products', (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send(`Error fetching user with ID ${id}`);  
        }
        else{
            res.send(result)
        }
    })
})*/

const allProduct = await Pool.query('SELECT * from products')
if(allProduct){
  res.send(allProduct.rows)
}
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
   /* Pool.query('SELECT * from products WHERE id = $1', [id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send(`Error fetching user with ID ${id}`);
      } else if (result.rows.length === 0) {
        res.status(404).send(`User with ID ${id} not found`);
      } else {
        res.send(result.rows[0]);
      }
    });
  });*/
  

  const query = 'SELECT * from products WHERE id = $1';
    const result = await Pool.query(query, [id]);
    if (result){
      res.status(200).send(result.rows)
    }
    else{
      res.status(404).send("id ${id} not found")
    }
  });


  const bodyParser = require('body-parser')
  router.use(bodyParser.json());
  router.post('/', async(req, res)=> {
    
   const user = req.body;
    console.log(req.body); 
    /*let insertQuery = `insert into products(id, name, price, image,quantity) 
                       values(${user?.id}, '${user.name}', ${user.price}, '${user.image}',${user.quantity})`
    Pool.query(insertQuery, (err, result)=>{
        if(!err){
            res.send('Insertion was successful')
        }
        else{ console.log(err.message) }
    })
    
})
*/
const insert =await Pool.query(`insert into products( name, price, image,quantity) 
               values('${user.name}', ${user.price}, '${user.image}',${user.quantity}) RETURNING id`)



               
if (insert){
  res.send("insertion was succesfull")
  
  //res.send("insertion was succesful")
  console.log("Insertion succesful")
}
else{
  res.status(404).send("error occured")
}
  });
    // client.end()


   router.put('/:id', async (req, res)=> {
    console.log(req);
    let user = req.body;
    const id= req.params.id
    const updateQuery =await Pool.query(`update products
                       set name = '${user.name}',
                       price = ${user.price},
                       image = '${user.image}',
                       quantity=${user.quantity}
                       where id = ${req.params.id}`)
/*
    Pool.query(updateQuery, (err, result)=>{
        if(!err){
            res.send('Update was successful')
        }
        else{ console.log(err.message) }
    })
    Pool.end;
})*/
if (updateQuery){
  res.status(200).send(`product with id ${id} updated succesful`)
  console.log("update was succesful")
}
   });


router.delete('/:id',async (req, res) => {
    const id = req.params.id;
  /*  Pool.query('DELETE FROM products WHERE id = $1', [id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send(`Error deleting user with ID ${id}`);
      } else if (result.rowCount === 0) {
        res.status(404).send(`User with ID ${id} not found`);
      } else {
        res.send(`User with ID ${id} deleted successfully`);
      }
    });
  });*/
const remove = 'DELETE FROM products WHERE id = $1';
const result =await Pool.query(remove,[id]);

if (result){
  res.status(200).send(`product with id ${id} deleted succesfully`)

}

});

module.exports = router;

