const { Pool } = require('pg');


const pool = new Pool({
host: process.env.DATABASE_HOST || 'localhost',
port: parseInt(process.env.DATABASE_PORT || '5432', 10),
user: process.env.DATABASE_USER || 'appuser',
password: process.env.DATABASE_PASSWORD || 'apppassword',
database: process.env.DATABASE_NAME || 'appdb',
});


module.exports = {
query: (text, params) => pool.query(text, params),
pool,
};