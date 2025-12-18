import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './utils/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Connect to Database
connectDB();

// Routes
import authRoutes from './routes/authRoutes';
import petRoutes from './routes/petRoutes';
import applicationRoutes from './routes/applicationRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/applications', applicationRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
