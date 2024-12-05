const express = require('express');
const cors = require('cors');
const mariadb = require('mariadb');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = 5000;

// Database connection details
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

app.use(cors());

app.get('/api/products', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `
            SELECT p.title, cat.name as category, cp.price, cp.comparable_price, cp.discount, cp.unit 
            FROM products p 
            LEFT JOIN categories cat ON p.category_id = cat.id
            LEFT JOIN current_prices cp ON p.id = cp.product_id
        `;
        const result = await conn.query(query);
        res.json(result);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (conn) conn.end();
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
