const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');

// Import routers
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const seedRoutes = require('./routes/seedRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Bind API Routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/seed', seedRoutes);

// Serves the client statically in production if built
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Fallback all non-API requests to Vite index.html (client SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'), (err) => {
    if (err) {
      // In development or if client is not built, send a simple JSON message
      res.status(200).json({ message: 'TaskManager REST API is running. Client build files not detected.' });
    }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Modular API Server running on port ${PORT}`);
});
