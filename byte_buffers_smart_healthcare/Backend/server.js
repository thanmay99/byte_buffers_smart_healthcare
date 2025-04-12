const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');

const app = express();
const PORT = 5001;
const DB_URI = 'mongodb://localhost:27017/project4'; // MongoDB URI

// Middleware - Order matters!
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json()); // Parse JSON body

// Routes
app.use('/api', dataRoutes);
app.use('/', authRoutes);

// Connect to MongoDB
mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ Failed to connect to MongoDB:', err));

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
