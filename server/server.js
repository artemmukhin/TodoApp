require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose').set('strictQuery', true);
const cors = require('cors');
const http = require('http');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Export for testing purposes
module.exports = { app, server };

// Start the server
const PORT = process.env.PORT || 5055;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
