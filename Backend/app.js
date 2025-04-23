import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/booking.js';
import { verifyToken } from './routes/auth.js';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type,Authorization',
}));
app.use(express.json());

app.use('/auth', authRoutes);

app.use('/booking', verifyToken, bookingRoutes);
app.listen(process.env.PORT, () => {
    console.log('Backend server is running on http://localhost:5000');
});
export default app;
