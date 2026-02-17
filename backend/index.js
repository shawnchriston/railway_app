require('dotenv').config();
const express = require('express');
const cors = require('cors');
const auth = require('./auth');
const app = express();

// Log every request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(auth);

app.get('/', (req, res) => {
  console.log('GET / - Railway backend API running');
  res.send('Railway backend API running');
});

// Error logging middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Internal Server Error');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} and address 0.0.0.0`);
});
