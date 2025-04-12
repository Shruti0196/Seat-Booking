import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../models/db.js';

const router = express.Router();


export const getAllUsers = async () => {
    try {
        const result = await pool.query('SELECT * FROM users');
        console.log(result.rows)
        return result.rows;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const users = await getAllUsers();
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
        'INSERT INTO users (name, password, email) VALUES ($1, $2, $3)',
        [username, hashedPassword, email]
    );

    res.status(201).json({ message: 'User created successfully' });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const users = await getAllUsers();
    const user = users.find(user => user.name === username);
    if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, 'secret_key', { expiresIn: '1h' });

    res.status(200).json({ token });
});

export const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(403).json({ message: 'Access denied' });
    }

    jwt.verify(token, 'secret_key', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

export default router;
