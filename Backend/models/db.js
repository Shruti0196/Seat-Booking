import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    user: 'postgres',
    host: 'localhost',
    database: 'seat_bookings_db',
    password: 'shruti',
    port: 5432,
});

export default pool;
