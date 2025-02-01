const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' }); 

const app = express();
const port = 5000;

app.use(morgan('combined'));

app.use((req, res, next) => {
    console.log(`CORS request from origin: ${req.headers.origin}`);
    next();
});

app.use(cors({
    origin: process.env.PUBLIC_URL,
    methods: 'GET',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ['CF-Access-Client-Id', 'CF-Access-Client-Secret']
}));

// Database connection details
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT, 
    max: 5
});

app.get('/products', async (req, res) => {
    let client;
    try {
        client = await pool.connect();
        const query = `
            SELECT p.title, c.name as category, cp.price, cp.comparable_price, cp.discount, cp.unit 
            FROM products p
            JOIN categories c ON p.category_id = c.id
            JOIN current_prices cp ON p.id = cp.product_id
        `;
        const result = await client.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).send('Server error');
    } finally {
        if (client) {
            client.release();
        }
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
