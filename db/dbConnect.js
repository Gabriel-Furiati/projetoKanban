// db/dbConnect.js
const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'dbprojeto1',
  connectionLimit: 5
});

async function executarQuery(sql, params = []) {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(sql, params);
    // mariadb returns an object with affectedRows/insertId for inserts; for selects it returns array
    return res;
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

module.exports = { executarQuery, pool };
