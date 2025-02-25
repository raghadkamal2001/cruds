const express = require('express')
const app = express()
const { Pool } = require('pg');
const port = 8080


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'taskdb',
    password: '1234',
    port: 5432,
  });

app.use(express.json());

async function createAlbumsTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS albums (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        artist VARCHAR(255) NOT NULL,
        price NUMERIC(10, 2)
      );
    `;

    await pool.query(query);
    console.log('Albums table created');
  } catch (err) {
    console.error(err);
    console.error('Albums table creation failed');
  }
}

createAlbumsTable();

pool.connect()
  .then((client) => {
    console.log("✅ Connected to PostgreSQL");

    // Insert query
    const query = `
      INSERT INTO albums (title, artist, price)
      VALUES ($1, $2, $3)
    `;

    // Values to insert
    const values = ['Album Title', 'Artist Name', 19.99];

    // Execute the query
    return client.query(query, values)
      .then((result) => {
        console.log('Data inserted successfully:', result.rowCount);
        client.release(); // Release the client back to the pool
      })
      .catch((err) => {
        console.error('Error inserting data:', err);
        client.release(); // Release the client back to the pool
      });
  })
  .catch((err) => {
    console.error("❌ Connection error", err);
  });
module.exports = pool;


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})