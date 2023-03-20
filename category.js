const express = require('express');
const router = express.Router();
//const app = express();
//const pg = require('pg');
const Pool = require('./config.js');

const bodyParser = require('body-parser')
router.use(bodyParser.json());
router.post('/', async (req, res) => {
  const user = req.body;
  console.log(req.body);

  const existingCode = await Pool.query(`SELECT id FROM category WHERE code = '${user.code}'`);
  if (existingCode.rows.length > 0) {
    return res.status(400).send({ message: 'Code already exists' });
  }



  const insert = await Pool.query(`insert into category( name, code,parent_id) 
               values('${user.name}', '${user.code}', ${user.parent_id}) RETURNING id`)
  if (insert) {
    res.send({
      status:true,
      data:insert.rows,
      message:"DATA INSERTED SUCCESFULLY"
    })
   
  }
  else {
    res.status(404).send("error occured")
  }
});


async function getDataById(id) {
  const client = await Pool.connect();
  try {
    var category = await client.query('SELECT * FROM category WHERE id = $1', [id]);
    category = category.rows[0];
    //console.log(category)
    var parentCategory = {}
    if (category.parent_id !== null) {
      // console.log("present");
       parentCategory = await getDataById(category.parent_id)
       category.parentCategory = parentCategory;
       
      
    } 
    
    // category.parentCategory = parentCategory.rows[0];
    return category; // return the first row if there is any

  } finally {
    client.release();
  }
}

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const data = await getDataById(id);
    
    if (!data) {
      return res.status(404).send('Data not found');
    }
    res.send({
      status:true,
      data:data,
      message:"DATA FOUND BY ID ${id}"
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

async function getAllchildDataById(id) {
  const client = await Pool.connect();
  try {
    var category = await client.query('SELECT * FROM category WHERE id = $1', [id]);
    category = category.rows[0];
    var childCategories = []
    const children = await client.query('SELECT * FROM category WHERE parent_id = $1', [id]);
    if (children.rows.length > 0) {
        for (const child of children.rows) {
            const childData = await getAllchildDataById(child.id);
            childCategories.push(childData);
        }
    } 
    category.childCategories = childCategories;
    return category; 

  } finally {
    client.release();
  }
}

router.get('/child/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const data = await getAllchildDataById(id);
    if (!data) {
      return res.status(404).send('Data not found');
    }
    res.send({
      status:true,
      data:data,
      message:"DATA FOUND"
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


/*
async function getAllDataById(id) {
  const client = await Pool.connect();
  try {
    const result = await client.query('SELECT * FROM category WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return null;
    }
    const category = result.rows[0];
    let parentCategory = null;
    if (category.parent_id !== null) {
      parentCategory = await getAllDataById(category.parent_id);
    }
    category.parentCategory = parentCategory;
    return category;
  } finally {
    client.release();
  }
}

async function getAllData() {
  const client = await Pool.connect();
  try {
    const result = await client.query('SELECT * FROM category');
    const data = [];
    for (const row of result.rows) {
      const category = await getAllDataById(row.id);
      data.push(category);
    }
    return data;
  } finally {
    client.release();
  }
}

router.get('/', async (req, res) => {
  try {
    const data = await getAllData();
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
*/
async function getAllData() {
  const client = await Pool.connect();
  try {
    // Start with root elements (elements with no parent)
    const rootElements = await client.query('SELECT * FROM category WHERE parent_id IS NULL');
    const result = [];

    // Recursively retrieve child elements for each root element
    for (const root of rootElements.rows) {
      const data = await getAllchildDataById(root.id);
      result.push(data);
    }
    return result;
  } finally {
    client.release();
  }
}
router.get('/', async (req, res) => {
  try {
    const data = await getAllData();
    res.send({
      status:true,
      data:data,
      message:"DATA FOUND"});
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



async function deleteDataById(id) {
  const client = await Pool.connect();
  try {
    const query = 'DELETE FROM category WHERE id = $1';
    await client.query(query, [id]);

    const childElements = await client.query('SELECT * FROM category WHERE parent_id = $1', [id]);
    for (const child of childElements.rows) {
      await deleteDataById(child.id);
    }
  } finally {
    client.release();
  }
}


router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const data = await deleteDataById(id);
    res.send({
      status:true,
      data:data,
      message:"DATA DELETED"
    });
//console.log("deleted succesfully")
    
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.put('/:id', async (req, res)=> {
  console.log(req);
  let user = req.body;
  const id= req.params.id
  const updateQuery =await Pool.query(`update category
                     set name = '${user.name}',
                     code = '${user.code}',
                     parent_id = '${user.parent_id}'                  
                     where id = ${req.params.id}`)

if (updateQuery){
  res.send({
    status:true,
    data:updateQuery.rows,
    message:"DATA UPDATED SUCCESFULLY"
  })
}
 });

 //module.exports =Pool;
module.exports = router;



