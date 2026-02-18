import React from 'react';

import Signup from './Signup';
import Dashboard from './Dashboard';
import { useState } from 'react';


function App() {
  const [page, setPage] = useState('signup');
  return (
    <div className="App">
      <h1>Welcome to the Railway App</h1>
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setPage('signup')}>Signup</button>
        <button onClick={() => setPage('dashboard')}>Dashboard</button>
      </div>
      {page === 'signup' ? <Signup /> : <Dashboard />}
    </div>
  );
}

export default App;
