require('dotenv').config();
const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: process.env.DB_HOST || process.env.DBHOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || process.env.DBPORT || 3306),
  user: process.env.DB_USER || process.env.DBUSER,
  password: process.env.DB_PASSWORD || process.env.DBPASS,
  database: process.env.DB_DATABASE || process.env.DBNAME,
  connectionLimit: 1,
  connectTimeout: 5000
});

(async () => {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('Conectado com sucesso');
  } catch (err) {
    console.error('Erro de conexão:', err.message);
  } finally {
    if (conn) conn.release();
    process.exit();
  }
})();
