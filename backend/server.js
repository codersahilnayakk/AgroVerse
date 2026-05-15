const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: [
    'http://localhost:3000',
    process.env.FRONTEND_URL, // Set this in Render env vars after Vercel deploy
    /\.vercel\.app$/
  ].filter(Boolean),
  credentials: true
}));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/advisory', require('./routes/advisoryRoutes'));
app.use('/api/forum', require('./routes/forumRoutes'));
app.use('/api/schemes', require('./routes/schemeRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/queries', require('./routes/queryRoutes'));

// Health check / root route
app.get('/', (req, res) => res.send('AgroVerse API is running...'));

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 