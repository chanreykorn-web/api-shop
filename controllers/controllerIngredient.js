import fs from 'fs';
import path from 'path';
import db from "../config/conn.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { fileURLToPath } from 'url';

// Create ingredient
export const create = async (req, res) => {
  try {
    const { name, descriptions, status = 1 } = req.body;
    const image = req.file ? req.file.filename : null;

    const [result] = await db.query(
      "INSERT INTO ingridient (name, image, descriptions, status) VALUES (?, ?, ?, ?)",
      [name, image, descriptions, status]
    );

    res.status(201).json({ message: "Ingredient created", id: result.insertId });
  } catch (err) {
    console.error("Error creating ingredient:", err);
    res.status(500).json({ error: err });
  }
};

// Get all ingredients
export const getAll = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM ingridient");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Get by id
export const getById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM ingridient WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Update ingredient
export const update = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    let image = req.file ? req.file.filename : null;

    // Get current image filename
    const [rows] = await db.query("SELECT image FROM ingridient WHERE id = ?", [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    const oldImage = rows[0].image;

    // Update ingredient
    await db.query(
      "UPDATE ingridient SET name = ?, descriptions = ?, status = ?, image = ? WHERE id = ?",
      [name, description, status, image || oldImage, req.params.id]
    );

    // If a new image was uploaded, delete the old one (except default.png)
    if (
      image &&
      oldImage &&
      oldImage !== 'default.png' &&
      image !== oldImage
    ) {
      fs.unlink(path.join(__dirname, '../uploads', oldImage), (err) => {
        if (err) {
          console.error('Failed to delete old image:', err);
        }
      });
    }

    res.json({ message: "Ingredient updated successfully" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete ingredient
export const remove = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT image FROM ingridient WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Not found" });

    const image = rows[0].image;

    await db.query("DELETE FROM ingridient WHERE id = ?", [req.params.id]);

    if (image) {
      fs.unlink(path.join('uploads', image), (err) => {
        if (err) console.error('Failed to delete image file:', err);
      });
    }

    res.json({ message: "ingridient deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: err });
  }
};
