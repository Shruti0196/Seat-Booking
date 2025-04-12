import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/booking.js';
import { verifyToken } from './routes/auth.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type,Authorization',
}));
app.use(express.json());

app.use('/auth', authRoutes);

app.use('/booking', verifyToken, bookingRoutes);
app.listen(5000, () => {
    console.log('Backend server is running on http://localhost:5000');
});
export default app;
