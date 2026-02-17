-- Users table for Admin, Athlete, and Guest roles
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  google_id VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role VARCHAR(20) NOT NULL DEFAULT 'athlete', -- 'admin', 'athlete', 'guest'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
