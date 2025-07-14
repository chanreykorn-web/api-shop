import jwt from "jsonwebtoken";
import db from "../config/conn.js";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

const JWT_SECRET = process.env.JWT_SECRET;

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await db.query(
      `SELECT u.*, r.name AS role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.username = ?`,
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const [perms] = await db.query(
      `SELECT p.name FROM permissions p
       JOIN role_permissions rp ON p.id = rp.permission_id
       WHERE rp.role_id = ?`,
      [user.role_id]
    );
    const permissions = perms.map(p => p.name);

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role_name, permissions },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
