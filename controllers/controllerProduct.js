import db from "../config/conn.js";
import multer from 'multer';
import path from 'path';
// import db from '../config/db.js'; 

export const getAll = async (req, res) => {
  try {
    // Fetch all product rows
    const [products] = await db.query(`SELECT * FROM products`);

    // Fetch reference tables
    const [ingredients] = await db.query(`SELECT id, name FROM ingridient`);
    const [categories] = await db.query(`SELECT id, name FROM categories`);
    const [sizes] = await db.query(`SELECT id, name FROM size`);

    // Create maps for easy lookup
    const ingredientMap = Object.fromEntries(ingredients.map(i => [i.id, i.name]));
    const categoryMap = Object.fromEntries(categories.map(c => [c.id, c.name]));
    const sizeMap = Object.fromEntries(sizes.map(s => [s.id, s.name]));

    const result = products.map((p) => {
      // Convert ingredient ID list to readable names
      let ingredientNames = [];
      try {
        const ids = JSON.parse(p.ingridient_id || '[]');
        ingredientNames = ids.map((id) => ingredientMap[id]).filter(Boolean);
      } catch (err) {
        ingredientNames = [];
      }

      return {
        ...p,
        ingredient_name: ingredientNames.join(', '),
        category_name: categoryMap[p.categories_id] || '',
        size_name: sizeMap[p.size_id] || ''
      };
    });

    res.json(result);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: err.message });
  }
};




export const getById = async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
      if (!rows.length) return res.status(404).json({ message: 'Not found' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Ensure this folder exists and is publicly accessible
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

export const upload = multer({ storage: storage });

// Controller function to create a product
export const create = async (req, res) => {
    const {
        name,
        descriptions,
        // price,
        rate,
        pickup_time,
        categories_id,
        size_id,
        ingridient_id,
        status
    } = req.body;

    const imagePath = req.file ? req.file.filename : null;

    try {
        const [result] = await db.query(
            `INSERT INTO products 
            (name, descriptions, rate, pickup_time, categories_id, size_id, ingridient_id, status, image)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name,
                descriptions,
                // price,
                rate,
                pickup_time,
                categories_id,
                size_id,
                ingridient_id || null,
                status,
                imagePath
            ]
        );

        res.status(201).json({ message: 'Product created successfully', id: result.insertId });
    } catch (err) {
        console.error('Insert error:', err);
        res.status(500).json({ error: 'Failed to create product' });
    }
};


export const update = async (req, res) => {
  try {
    const {
      name,
      descriptions,
      rate,
      pickup_time,
      categories_id,
      size_id,
      ingredients, // this is a JSON string of array
      status
    } = req.body;

    const ingridient_id = JSON.parse(ingredients); // parse array from JSON string

    const image = req.file ? req.file.filename : null;

    await db.query(`
      UPDATE products SET 
        name = ?, 
        descriptions = ?, 
        rate = ?, 
        pickup_time = ?, 
        categories_id = ?, 
        size_id = ?, 
        ingridient_id = ?, 
        status = ?${image ? ', image = ?' : ''}
      WHERE id = ?
    `, image
      ? [name, descriptions, rate, pickup_time, categories_id, size_id, JSON.stringify(ingridient_id), status, image, req.params.id]
      : [name, descriptions, rate, pickup_time, categories_id, size_id, JSON.stringify(ingridient_id), status, req.params.id]
    );

    res.json({ message: "Product updated successfully" });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: "Failed to update product" });
  }
};



export const deleted = async (req, res) => {
    try {
      await db.query('UPDATE products SET status = 0 WHERE id = ?', [req.params.id]);
      res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};
  