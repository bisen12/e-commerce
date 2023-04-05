const express = require('express');
const router = express.Router();
const Pool = require('./config.js');
const { log } = require('console');
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

// async function getAllDataById(id) {
//   try {
//     const result = await Pool.query('SELECT id, value FROM products WHERE category_id = $1', [c.id]);
//     if (result.rows.length === 0) {
//       return null;
//     }
//     const products = result.rows[0];
//     let categorId = null;
//     if (products.category_id !== null) {
//       categorId = await getAllDataById( products.category_id);
//     }
//     products.parentCategory = categorId;
//     return products;
//   }
//   catch (err) {
//     console.log(err)
//   }
// }

// async function getAllData() {
//   try {
//     const result = await Pool.query(`SELECT * FROM category`);
//     const data = [];
//     for (const row of result.rows) {
//       const product = await getAllDataById(row.id);
//       data.push(product);
//     }
//     return data;
//   } 
//   catch (err) {
//     console.log(err)
//   }
// }

// router.get('/', async (req, res) => {
//   try {
//     const data = await getAllData();
//     res.send(data);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  console.log(Number(id));
  if (!isNaN(Number(id))) {
    const product = 
      `SELECT products.id, products.name, products.price,products.image,products.quantity, category.id AS category_id
      FROM products
      INNER JOIN category ON products.category_id = category.id
      WHERE products.id = $1`;
    // console.log(product)
    const data = await Pool.query(product, [id])
    if (data.rows.length > 0) {
      res.send({
        status: true,
        data: data.rows,
        message: `DATA WITH ID ${id} FETCHED SUCCESFULLY`
      })
    } else {
      console.log("data not found")
      res.status(404).send({
        status: false,
        message: `DATA NOT FOUND`
      })
    }
  }
  else {
    res.status(404).send({
      status: false,
      message: "INVALID ID"
    })
  }
});


// router.get('/prod/:id', async (req, res, next) => {
//   try {
//     const id = req.params.id;
//     const data = await getDataById(id);
//     if (data) {
//       res.status(200).json(data.rows);
//     } else {
//       res.status(404).json({ message: 'Data not found' });
//     }
//   } catch (err) {
//     next(err);
//   }
// });

// router.get('/:id', async (req, res) => {
//   // console.log(req.params.id);
//   const id = req.params.id;
//   console.log(Number(id));
//   if (!isNaN(Number(id))) {
//     const query = 'SELECT * from products WHERE id = $1';
//     console.log(query);
//     const result = await Pool.query(query, [id]);
//     if (result.rows.length > 0) {
//       res.status(200).send({
//         status: true,
//         data: result.rows,
//         message: `DATA WITH ID ${id} FETCHED SUCCESFULLY`
//       }
//       )
//     }
//     else {
//       res.status(404).send({
//         status: false,
//         message: `DATA NOT FOUND`
//       })
//     }
//   } else {
//     res.status(404).send({
//       status: false,
//       message: `INVALID ID`
//     })
//   }

// });

router.get('/products', async (req, res) => {
  try {
    const products = await Pool.query(
      `SELECT p.id, p.name, p.price, p.image,p.quantity, c.name AS category FROM products p INNER JOIN category c ON p.category_id = c.id`
    );
    res.json(products.rows);
  } catch (err) {
    console.error(err.message);
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
