require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const cookieParser = require('cookie-parser');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const adminRoutes = require('./routes/adminRoutes');

// 1. Initialize App (MUST happen before using any app.use)
const app = express();

// 2. Connect Database
connectDB();

// 3. Middlewares
app.use(helmet()); // Adds security headers
app.use(cors({ 
    origin: process.env.CLIENT_URL, 
    credentials: true 
}));
app.use(express.json()); // Parses JSON bodies
app.use(cookieParser());

// 4. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/admin', adminRoutes); // Admin routes registered once here

// 5. Global Error Handler (Must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));