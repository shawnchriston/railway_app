import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://railwayapp-production-6cdb.up.railway.app';

  useEffect(() => {
    fetch(`${backendUrl}/competitions`)
      .then(res => res.json())
      .then(data => {
        setCompetitions(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load competitions');
        setLoading(false);
      });
  }, [backendUrl]);

  if (loading) return <div>Loading competitions...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: 20 }}>
      <h2>Upcoming Competitions</h2>
      {competitions.length === 0 ? (
        <div>No competitions found.</div>
      ) : (
        <ul>
          {competitions.map(comp => (
            <li key={comp.id} style={{ marginBottom: 16 }}>
              <strong>{comp.name}</strong> <br />
              Date: {comp.date} <br />
              Location: {comp.location || 'TBA'} <br />
              {comp.description && <span>{comp.description}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
