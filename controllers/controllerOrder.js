import db from "../config/conn.js";
import crypto from 'crypto';

const generateRandomCode = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

// ✅ Create Order
export const createOrder = async (req, res) => {
    const { categories_id, user_id, product_id, qt, status } = req.body;
    const code = generateRandomCode(10); // Random 10-char code

    try {
        const conn = await db.getConnection();
        
        const [result] = await conn.execute(
            'INSERT INTO `order` (categories_id, user_id, product_id, code, qt, status) VALUES (?, ?, ?, ?, ?, ?)',
            [categories_id, user_id, product_id, code, qt, status]
        );

        conn.release();
        res.status(201).json({ message: 'Order created', id: result.insertId, code });

    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// ✅ Get All Orders
export const getAllOrders = async (req, res) => {
  try {
    const conn = await db.getConnection();

    const [rows] = await db.execute(`
  SELECT p.*, c.*
  FROM products p
  JOIN categories c ON p.categories_id = c.id
`);


    conn.release();
    res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// ✅ Delete Order
export const deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const conn = await db.getConnection();
        const [result] = await conn.execute(`DELETE FROM order WHERE id = ?`, [id]);
        conn.release();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json({ message: 'Order deleted' });
    } catch (err) {
        console.error('Error deleting order:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
