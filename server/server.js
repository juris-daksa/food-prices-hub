const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

const app = express();
const port = process.env.API_SERVER_PORT || 5000;

app.use(morgan('combined'));

const allowedOrigins = [
  process.env.UI_LOCAL_HOST,
  process.env.UI_PUBLIC_DEV_HOST,
  process.env.UI_PUBLIC_HOST
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['CF-Access-Client-Id', 'CF-Access-Client-Secret']
}));

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
      SELECT p.id as product_id, p.title, p.product_url, c.name as category, 
        cep.retail_price, cep.discount_price, cep.loyalty_price, 
        cep.retail_comparable_price, cep.discount_comparable_price, cep.loyalty_comparable_price, 
        cep.unit, cep.date_updated as date_price_updated, 
        cep.discount_percentage, cep.loyalty_discount_percentage, s.name as store_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN current_extended_prices cep ON p.id = cep.product_id
      JOIN stores s ON p.store_id = s.id
    `;
    const result = await client.query(query);
    
    const transformedResult = result.rows.map(row => ({
      product_id: row.product_id,
      title: row.title,
      product_url: row.product_url,
      category: row.category,
      store_name: row.store_name,
      prices: {
        retail: {
          price: row.retail_price,
          comparable: row.retail_comparable_price
        },
        discount: row.discount_price ? {
          price: row.discount_price,
          comparable: row.discount_comparable_price,
          discount_percentage: row.discount_percentage
        } : null,
        loyalty: row.loyalty_price ? {
          price: row.loyalty_price,
          comparable: row.loyalty_comparable_price,
          loyalty_discount_percentage: row.loyalty_discount_percentage
        } : null,
        unit: row.unit,
        date_price_updated: row.date_price_updated
      }
    }));

    res.json(transformedResult);
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
