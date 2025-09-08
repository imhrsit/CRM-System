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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
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
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [viewDialog, setViewDialog] = useState({ open: false, lead: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, leadId: null });

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
    const { name, value } = e.target;
    if (name === 'interestLevel') {
      const numValue = parseInt(value);
      if (value !== '' && (isNaN(numValue) || numValue < 0 || numValue > 10)) {
        return;
      }
    }
    
    setForm({ ...form, [name]: value });
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

  // Get lead by ID
  const fetchLeadById = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      const data = await res.json();
      return data;
    } catch (err) {
      setError('Failed to fetch lead details');
      return null;
    }
  };

  // Update lead
  const handleUpdate = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error('Failed to update lead');
      setEditingId(null);
      setEditForm({});
      await fetchLeads();
      setError('');
    } catch (err) {
      setError('Failed to update lead');
      setLoading(false);
    }
  };

  // Delete lead
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete lead');
      setDeleteDialog({ open: false, leadId: null });
      await fetchLeads();
      setError('');
    } catch (err) {
      setError('Failed to delete lead');
      setLoading(false);
    }
  };

  // Handle view lead
  const handleView = async (id) => {
    const lead = await fetchLeadById(id);
    if (lead) {
      setViewDialog({ open: true, lead });
    }
  };

  // Handle edit lead
  const handleEdit = (lead) => {
    setEditingId(lead.id);
    setEditForm({ ...lead });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  // Handle edit form change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === 'interestLevel') {
      const numValue = parseInt(value);
      if (value !== '' && (isNaN(numValue) || numValue < 0 || numValue > 10)) {
        return;
      }
    }
    
    setEditForm({ ...editForm, [name]: value });
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
          <TextField 
            name="interestLevel" 
            label="Interest Level" 
            value={form.interestLevel} 
            onChange={handleChange} 
            type="number" 
            inputProps={{ min: 0, max: 10 }}
            fullWidth 
          />
          <TextField name="description" label="Description" value={form.description} onChange={handleChange} multiline rows={2} fullWidth />
          <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mt: 2, borderRadius: 2 }}>
            Add Lead
          </Button>
        </form>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3, width: '100%', maxWidth: '95vw', minHeight: 320, transition: 'min-height 0.2s', overflow: 'auto' }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#0176d3' }}>Leads</Typography>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <TableHead sx={{ background: '#eaf4fb' }}>
              <TableRow>
                <TableCell sx={{ minWidth: 120 }}>Name</TableCell>
                <TableCell sx={{ minWidth: 180 }}>Email</TableCell>
                <TableCell sx={{ minWidth: 100 }}>Source</TableCell>
                <TableCell sx={{ minWidth: 80 }} align="center">Interest Level</TableCell>
                <TableCell sx={{ minWidth: 150 }}>Description</TableCell>
                <TableCell sx={{ minWidth: 140, width: 140 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell sx={{ minWidth: 120, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {editingId === lead.id ? (
                      <TextField
                        name="name"
                        value={editForm.name || ''}
                        onChange={handleEditChange}
                        size="small"
                        fullWidth
                      />
                    ) : (
                      <span title={lead.name}>{lead.name}</span>
                    )}
                  </TableCell>
                  <TableCell sx={{ minWidth: 180, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {editingId === lead.id ? (
                      <TextField
                        name="email"
                        value={editForm.email || ''}
                        onChange={handleEditChange}
                        size="small"
                        fullWidth
                      />
                    ) : (
                      <span title={lead.email}>{lead.email}</span>
                    )}
                  </TableCell>
                  <TableCell sx={{ minWidth: 100, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {editingId === lead.id ? (
                      <TextField
                        name="source"
                        value={editForm.source || ''}
                        onChange={handleEditChange}
                        size="small"
                        fullWidth
                      />
                    ) : (
                      <span title={lead.source}>{lead.source}</span>
                    )}
                  </TableCell>
                  <TableCell sx={{ minWidth: 80, width: 80 }} align="center">
                    {editingId === lead.id ? (
                      <TextField
                        name="interestLevel"
                        type="number"
                        value={editForm.interestLevel || ''}
                        onChange={handleEditChange}
                        size="small"
                        inputProps={{ min: 0, max: 10 }}
                        fullWidth
                      />
                    ) : (
                      <Chip 
                        label={lead.interestLevel} 
                        color={lead.interestLevel >= 7 ? 'success' : lead.interestLevel >= 4 ? 'warning' : 'default'}
                        size="small"
                        sx={{ minWidth: 40, width: 40, height: 40, borderRadius: 1 }}
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ minWidth: 150, maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {editingId === lead.id ? (
                      <TextField
                        name="description"
                        value={editForm.description || ''}
                        onChange={handleEditChange}
                        size="small"
                        multiline
                        fullWidth
                      />
                    ) : (
                      <span title={lead.description}>{lead.description}</span>
                    )}
                  </TableCell>
                  <TableCell sx={{ minWidth: 140, width: 140 }} align="center">
                    {editingId === lead.id ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <IconButton
                          color="primary"
                          onClick={() => handleUpdate(lead.id)}
                          disabled={loading}
                          size="small"
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={handleCancelEdit}
                          size="small"
                        >
                          <CancelIcon />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <IconButton
                          color="primary"
                          onClick={() => handleView(lead.id)}
                          size="small"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(lead)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => setDeleteDialog({ open: true, leadId: lead.id })}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* View Dialog */}
      <Dialog open={viewDialog.open} onClose={() => setViewDialog({ open: false, lead: null })} maxWidth="sm" fullWidth>
        <DialogTitle>Lead Details</DialogTitle>
        <DialogContent>
          {viewDialog.lead && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="body1" sx={{ mb: 1 }}><strong>Name:</strong> {viewDialog.lead.name}</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}><strong>Email:</strong> {viewDialog.lead.email}</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}><strong>Source:</strong> {viewDialog.lead.source}</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}><strong>Interest Level:</strong> {viewDialog.lead.interestLevel}</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}><strong>Description:</strong> {viewDialog.lead.description}</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}><strong>Created:</strong> {new Date(viewDialog.lead.createdAt).toLocaleString()}</Typography>
              <Typography variant="body1"><strong>Updated:</strong> {new Date(viewDialog.lead.updatedAt).toLocaleString()}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog({ open: false, lead: null })}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, leadId: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this lead? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, leadId: null })}>Cancel</Button>
          <Button onClick={() => handleDelete(deleteDialog.leadId)} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;
