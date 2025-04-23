// import pkg from 'pg';
// import dotenv from 'dotenv';

// dotenv.config();
// const { Pool } = pkg;

// // const { Pool } = require('pg');

// // Use DATABASE_URL from the environment variable
// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         rejectUnauthorized: false, // For Render-hosted DBs, use SSL
//     },
// });

// pool.query('SELECT NOW()', (err, res) => {
//     if (err) {
//       console.error('Database connection failed', err);
//     } else {
//       console.log('Database connected at:', res.rows[0].now);
//     }
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

export default pool;
