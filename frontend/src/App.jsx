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
  const [loading, setLoading] = useState(false);
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
      fetchLeads();
      setError('');
    } catch (err) {
      setError('Failed to add lead');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f4f6fb' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: 1201, background: '#0176d3' }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            CRM System
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', background: '#fff' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem component="button">
              <ListItemIcon>
                <GroupIcon sx={{ color: '#0176d3' }} />
              </ListItemIcon>
              <ListItemText primary="Leads" />
            </ListItem>
            <ListItem component="button">
              <ListItemIcon>
                <AddCircleIcon sx={{ color: '#0176d3' }} />
              </ListItemIcon>
              <ListItemText primary="Add Lead" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography variant="h4" sx={{ mb: 2, color: '#0176d3', fontWeight: 700 }}>
          Lead Management
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#0176d3' }}>Add New Lead</Typography>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
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
        <Typography variant="h6" sx={{ mb: 2, color: '#0176d3' }}>Leads</Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 3 }}>
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
        )}
      </Box>
    </Box>
  );
}

export default App;
