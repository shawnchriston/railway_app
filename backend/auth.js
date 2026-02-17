const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const expressSession = require('express-session');
const express = require('express');
const pool = require('./db');
const app = express();

app.use(expressSession({
  secret: process.env.SESSION_SECRET || 'your_secret',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const google_id = profile.id;
    const name = profile.displayName;
    // Check if user exists
    let user = await pool.query('SELECT * FROM users WHERE google_id = $1', [google_id]);
    if (user.rows.length === 0) {
      // Assign admin if first user, else athlete
      const role = (await pool.query('SELECT COUNT(*) FROM users')).rows[0].count === '0' ? 'admin' : 'athlete';
      const insert = await pool.query(
        'INSERT INTO users (google_id, email, name, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [google_id, email, name, role]
      );
      user = insert;
    }
    return done(null, user.rows[0]);
  } catch (err) {
    return done(err, null);
  }
}));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/');
  }
);

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Endpoint to get current user info
app.get('/api/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.json({ role: 'guest' });
  }
});

module.exports = app;
