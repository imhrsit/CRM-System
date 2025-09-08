
import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:5003/api/leads';

function App() {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    source: '',
    interestLevel: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch leads
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setLeads(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch leads');
    }
    setLoading(false);
  };

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add lead
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to add lead');
      setForm({ name: '', email: '', source: '', interestLevel: '', description: '' });
      fetchLeads();
      setError('');
    } catch (err) {
      setError('Failed to add lead');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Mini CRM - Lead Management</h1>
      <form onSubmit={handleSubmit} className="lead-form">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
        <input name="source" value={form.source} onChange={handleChange} placeholder="Source" />
        <input name="interestLevel" value={form.interestLevel} onChange={handleChange} placeholder="Interest Level" type="number" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
        <button type="submit" disabled={loading}>Add Lead</button>
      </form>
      {error && <p className="error">{error}</p>}
      <h2>Leads</h2>
      {loading ? <p>Loading...</p> : (
        <ul className="lead-list">
          {leads.map(lead => (
            <li key={lead.id}>
              <strong>{lead.name}</strong> ({lead.email})<br />
              Source: {lead.source} | Interest Level: {lead.interestLevel}<br />
              Description: {lead.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
