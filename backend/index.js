require('dotenv').config();
const express = require('express');
const cors = require('cors');
const auth = require('./auth');
const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(auth);

app.get('/', (req, res) => {
  res.send('Railway backend API running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
