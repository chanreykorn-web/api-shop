import bcrypt from "bcrypt";
import db from "../config/conn.js";




export const createUser = async (req, res) => {
  const { username, password, email, role_id = 2 } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (username, password, email, role_id) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, email, role_id]
    );
    res.status(201).json({ id: result.insertId, username, email, role_id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT u.id, u.username, u.email, r.name AS role
       FROM users u
       JOIN roles r ON u.role_id = r.id`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await db.query(
      'SELECT id, username, email, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { username, password, email, status, role_id = 2 } = req.body;
  try {
    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'UPDATE users SET username = ?, password = ?, email = ?, status = ? WHERE id = ?',
      [username, hashedPassword, email, status, id, role_id]
    );

    if (result.affectedRows > 0) {
      res.json({ id, username, email });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'User deleted' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
