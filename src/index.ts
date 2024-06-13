import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import postRoutes from './routes/post';

// testing the commit and add
// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
// localhost:3000/api/auth
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
// app.use('/api/user', userRoutes);
// app.use('/api/comment', commentRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
