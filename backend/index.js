
const express = require('express');
const app = express();
const { Pool } = require('pg');
const pool = new Pool();


// Auto-create users table if not exists
const userTableSql = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;
pool.query(userTableSql)
  .then(() => console.log('Ensured users table exists'))
  .catch(err => console.error('Error creating users table:', err));

const cors = require('cors');
app.use(cors({
  origin: 'https://frontend-production-ffd6.up.railway.app',
  credentials: true
}));
app.use(express.json());

const session = require('express-session');
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true }
}));

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [id]);
    if (result.rows.length > 0) done(null, result.rows[0]);
    else done(null, false);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return done(null, false, { message: 'Incorrect email.' });
    const user = result.rows[0];
    if (user.password !== password) return done(null, false, { message: 'Incorrect password.' });
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

app.post('/signin', passport.authenticate('local'), (req, res) => {
  res.json({ id: req.user.id, username: req.user.username, email: req.user.email });
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password required' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      res.status(409).json({ error: 'Username or email already exists' });
    } else {
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// List all competitions
app.get('/competitions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM competitions ORDER BY date ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});
