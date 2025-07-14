import db from "../config/conn.js";

// Get all categories
export const getAll = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM categories");
    res.json(results);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: err });
  }
};

// Get category by ID
export const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const [results] = await db.query("SELECT * FROM categories WHERE id = ?", [id]);
    if (results.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(results[0]);
  } catch (err) {
    console.error("Error fetching category by ID:", err);
    res.status(500).json({ error: err });
  }
};

// Create new category
export const create = async (req, res) => {
  try {
    const { name, description, status} = req.body;
    const user_id = req.user.id;  // ✅ safer

    if (!name || !description) {
      return res.status(400).json({ message: "Name and description are required." });
    }

    const [result] = await db.query(
      "INSERT INTO categories (name, description, user_id, status) VALUES (?, ?, ?, ?)",
      [name, description, user_id, status]
    );

    res.status(201).json({ message: "Category created", id: result.insertId });
  } catch (err) {
    console.error("Error creating category:", err);
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ message: 'Invalid user_id: user does not exist' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update category
export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, user_id, status } = req.body;
    const [result] = await db.query(
      "UPDATE categories SET name = ?, description = ?, user_id = ?, status = ? WHERE id = ?",
      [name, description, user_id, status, id]
    );
    res.json({ message: "Category updated" });
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({ error: err });
  }
};

// Delete category
export const deleted = async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await db.query("DELETE FROM categories WHERE id = ?", [id]);
    res.json({ message: "Category deleted" });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ error: err });
  }
};
