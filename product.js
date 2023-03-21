const express = require('express');
const router = express.Router();
const Pool = require('./config.js');
//const app = express();
//const pg = require('pg');





router.get('/', async (req, res) => {



  const allProduct = await Pool.query('SELECT * from products')
  if (allProduct) {

    res.send({
      status: true,
      data: allProduct.rows,
      message: "PRODUCT_FETCH_SUCCESS"
    })
  }
});

router.get('/:id', async (req, res) => {
  // console.log(req.params.id);
  const id = req.params.id;
  console.log(Number(id));
  if (!isNaN(Number(id))) {
    const query = 'SELECT * from products WHERE id = $1';
    console.log(query);
    const result = await Pool.query(query, [id]);
    if (result.rows.length > 0) {
      res.status(200).send({
        status: true,
        data: result.rows,
        message: `DATA WITH ID ${id} FETCHED SUCCESFULLY`
      }
      )
    }
    else {
      res.status(404).send({
        status: false,
        message: `DATA NOT FOUND`
      })
    }
  }else{
    res.status(404).send({
      status: false,
      message: `INVALID ID`
    })
  }

});

router.post('/', async (req, res) => {
  const user = req.body;
  console.log(req.body);

  try {
    // Check if product with the same name already exists
    const existingProduct = await Pool.query(`
        SELECT * FROM products WHERE name = '${user.name}'
      `);
    if (existingProduct.rowCount > 0) {
      res.status(400).send({
        status: false,
        message: 'Product with this name already exists'
      });
      return;
    }

    // Insert new product
    const insert = await Pool.query(`
        INSERT INTO products (name, price, image, quantity) 
        VALUES ('${user.name}', ${user.price}, '${user.image}', ${user.quantity})
        RETURNING id
      `);

    res.send({
      status: true,
      data: insert.rows,
      message: `Data inserted successfully`
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: false,
      message: `Error inserting data: ${error.message}`
    });
  }
});



router.put('/:id', async (req, res) => {
  console.log(req);
  let user = req.body;
  const id = req.params.id
  const updateQuery = await Pool.query(`update products
                       set name = '${user.name}',
                       price = ${user.price},
                       image = '${user.image}',
                       quantity=${user.quantity}
                       where id = ${req.params.id}`)

  if (updateQuery) {
    res.status(200).send({
      status: true,
      message: `DATA UPDATED SUCCESFULLY`
    })

  }
});


router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  const remove = 'DELETE FROM products WHERE id = $1';
  const result = await Pool.query(remove, [id]);

  if (result) {
    res.status(200).send({
      status: true,

      message: "DATA DELETED SUCCESFULLY"
    })
  }

});

module.exports = router;
