import React from 'react';

import Signup from './Signup';
import Signin from './Signin';
import Dashboard from './Dashboard';
import { useState, useEffect } from 'react';


function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);

  // Check session on mount
  useEffect(() => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://railwayapp-production-6cdb.up.railway.app';
    fetch(`${backendUrl}/api/me`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data && data.id) setUser(data);
      });
  }, []);

  const handleSignin = (userData) => {
    setUser(userData);
    setPage('dashboard');
  };

  const handleSignout = async () => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://railwayapp-production-6cdb.up.railway.app';
    await fetch(`${backendUrl}/logout`, { credentials: 'include' });
    setUser(null);
    setPage('home');
  };

  return (
    <div className="App">
      <h1>Welcome to the Railway App</h1>
      <div style={{ marginBottom: 20 }}>
        {!user && <>
          <button onClick={() => setPage('signin')}>Sign In</button>
          <button onClick={() => setPage('signup')}>Sign Up</button>
        </>}
        {user && <>
          <button onClick={() => setPage('dashboard')}>Dashboard</button>
          <button onClick={handleSignout}>Sign Out</button>
        </>}
      </div>
      {page === 'home' && !user && <div>Welcome! Please sign in or sign up.</div>}
      {page === 'signup' && !user && <Signup />}
      {page === 'signin' && !user && <Signin onSignin={handleSignin} />}
      {page === 'dashboard' && user && <Dashboard />}
      {page === 'dashboard' && !user && <div>Please sign in to view the dashboard.</div>}
    </div>
  );
}

export default App;
