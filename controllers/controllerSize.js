import db from '../config/conn.js'; // adjust this path

export const getAllSizes = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM size");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching sizes:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSizeById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM size WHERE id = ?", [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Size not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching size:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createSize = async (req, res) => {
  try {
    const { name, description, user_id, status } = req.body;
    await db.query(
      "INSERT INTO size (name, description, user_id, status) VALUES (?, ?, ?, ?)",
      [name, description, user_id, status]
    );
    res.json({ message: "Size created successfully" });
  } catch (err) {
    console.error("Error creating size:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateSize = async (req, res) => {
  try {
    const { name, description, user_id, status } = req.body;
    const [result] = await db.query(
      "UPDATE size SET name = ?, description = ?, user_id = ?, status = ? WHERE id = ?",
      [name, description, user_id, status, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Size not found" });
    }
    res.json({ message: "Size updated successfully" });
  } catch (err) {
    console.error("Error updating size:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteSize = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM size WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Size not found" });
    }
    res.json({ message: "Size deleted successfully" });
  } catch (err) {
    console.error("Error deleting size:", err);
    res.status(500).json({ message: "Server error" });
  }
};
