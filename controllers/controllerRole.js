import db from "../config/conn.js";


export const getCurrentUser = async (req, res) => {
    try {
      // Get user basic info with role
      const [userRows] = await db.query(
        `SELECT u.id, u.username, u.role_id, r.name AS role
         FROM users u
         JOIN roles r ON u.role_id = r.id
         WHERE u.id = ?`,
        [req.user.id]
      );
  
      if (userRows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const user = userRows[0];
  
      // Get user permissions based on role_id
      const [permRows] = await db.query(
        `SELECT p.name
         FROM permissions p
         JOIN role_permissions rp ON p.id = rp.permission_id
         WHERE rp.role_id = ?`,
        [user.role_id]
      );
  
      const permissions = permRows.map(p => p.name);
  
      res.json({
        id: user.id,
        username: user.username,
        role: user.role,
        permissions,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};


export const getAllRoles = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM roles');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
};

export const getRoleById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM roles WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Role not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch role' });
  }
};

export const createRole = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const [result] = await db.query('INSERT INTO roles (name) VALUES (?)', [name]);
    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create role' });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const [result] = await db.query('UPDATE roles SET name = ? WHERE id = ?', [name, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Role not found' });

    res.json({ id: req.params.id, name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update role' });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM roles WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Role not found' });

    res.json({ message: 'Role deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete role' });
  }
};