import { useState, useEffect } from 'react';
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import './App.css';

const drawerWidth = 220;
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
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
      await fetchLeads();
      setError('');
    } catch (err) {
      setError('Failed to add lead');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
      <CssBaseline />
      {loading && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', bgcolor: 'rgba(255,255,255,0.7)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress size={60} thickness={5} color="primary" />
        </Box>
      )}
      <AppBar position="static" sx={{ background: '#0176d3', mb: 4 }}>
        <Toolbar>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            CRM System - Lead Management
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3, width: '100%', maxWidth: 600, minHeight: 380, transition: 'min-height 0.2s' }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#0176d3' }}>Add New Lead</Typography>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <TextField name="name" label="Name" value={form.name} onChange={handleChange} required fullWidth />
          <TextField name="email" label="Email" value={form.email} onChange={handleChange} required fullWidth />
          <TextField name="source" label="Source" value={form.source} onChange={handleChange} fullWidth />
          <TextField name="interestLevel" label="Interest Level" value={form.interestLevel} onChange={handleChange} type="number" fullWidth />
          <TextField name="description" label="Description" value={form.description} onChange={handleChange} multiline rows={2} fullWidth />
          <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mt: 2, borderRadius: 2 }}>
            Add Lead
          </Button>
        </form>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3, width: '100%', maxWidth: 900, minHeight: 320, transition: 'min-height 0.2s' }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#0176d3' }}>Leads</Typography>
        <TableContainer>
          <Table>
            <TableHead sx={{ background: '#eaf4fb' }}>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Interest Level</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell>{lead.interestLevel}</TableCell>
                  <TableCell>{lead.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default App;
