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
  Badge,
  Tooltip,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import './App.css';

const drawerWidth = 220;
const API_URL = 'http://localhost:5003/api/leads';

// Helper function to get assignment styling
const getAssignmentStyle = (assignedTo) => {
  if (!assignedTo) return { color: 'default', textColor: '#666' };
  
  switch (assignedTo) {
    case 'Senior Sales Rep':
      return { 
        color: 'success', 
        textColor: '#2e7d32'  // Green
      };
    case 'Junior Sales Rep':
      return { 
        color: 'warning', 
        textColor: '#ef6c00'  // Orange
      };
    case 'Nurture Later':
      return { 
        color: 'info', 
        textColor: '#1976d2'  // Blue
      };
    default:
      return { color: 'default', textColor: '#666' };
  }
};


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

  // Score lead with AI
  const handleScore = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}/score`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to score lead');
      await fetchLeads();
      setError('');
    } catch (err) {
      setError('Failed to score lead: ' + err.message);
    }
    setLoading(false);
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ color: '#0176d3' }}>Leads Dashboard</Typography>
          
          {/* Assignment Summary */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Chip
              icon={<StarIcon sx={{ fontSize: 16 }} />}
              label={`Senior: ${leads.filter(l => l.assignedTo === 'Senior Sales Rep').length}`}
              size="small"
              sx={{ backgroundColor: '#e8f5e8', color: '#2e7d32', fontWeight: 600 }}
            />
            <Chip
              icon={<TrendingUpIcon sx={{ fontSize: 16 }} />}
              label={`Junior: ${leads.filter(l => l.assignedTo === 'Junior Sales Rep').length}`}
              size="small"
              sx={{ backgroundColor: '#fff3e0', color: '#ef6c00', fontWeight: 600 }}
            />
            <Chip
              icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
              label={`Nurture: ${leads.filter(l => l.assignedTo === 'Nurture Later').length}`}
              size="small"
              sx={{ backgroundColor: '#e3f2fd', color: '#1976d2', fontWeight: 600 }}
            />
            <Chip
              label={`Unassigned: ${leads.filter(l => !l.assignedTo).length}`}
              size="small"
              variant="outlined"
              sx={{ color: '#666', borderColor: '#ddd', fontWeight: 600 }}
            />
          </Box>
        </Box>
        <TableContainer sx={{ minWidth: 1100 }}>
          <Table>
            <TableHead sx={{ background: '#eaf4fb' }}>
              <TableRow>
                <TableCell sx={{ minWidth: 120 }}>Name</TableCell>
                <TableCell sx={{ minWidth: 180 }}>Email</TableCell>
                <TableCell sx={{ minWidth: 100 }}>Source</TableCell>
                <TableCell sx={{ minWidth: 80 }} align="center">Interest Level</TableCell>
                <TableCell sx={{ minWidth: 150 }}>Description</TableCell>
                <TableCell sx={{ minWidth: 80 }} align="center">Score</TableCell>
                <TableCell sx={{ minWidth: 140 }} align="center">Assigned To</TableCell>
                <TableCell sx={{ minWidth: 160, width: 160 }} align="center">Actions</TableCell>
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
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {lead.interestLevel}
                      </Typography>
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
                  <TableCell sx={{ minWidth: 80, width: 80 }} align="center">
                    {lead.score != null ? (
                      <Chip 
                        label={lead.score} 
                        color={lead.score >= 70 ? 'success' : lead.score >= 40 ? 'warning' : 'error'}
                        size="small"
                        sx={{ minWidth: 45, width: 45, height: 30, borderRadius: 1 }}
                      />
                    ) : (
                      <span style={{ color: '#999' }}>-</span>
                    )}
                  </TableCell>
                  <TableCell sx={{ minWidth: 140, width: 140 }} align="center">
                    {lead.assignedTo ? (
                      <Tooltip title={`Assigned to ${lead.assignedTo}`} arrow>
                        <Typography
                          variant="body2"
                          sx={{
                            color: getAssignmentStyle(lead.assignedTo).textColor,
                            fontWeight: 600,
                            fontSize: '0.875rem'
                          }}
                        >
                          {lead.assignedTo}
                        </Typography>
                      </Tooltip>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{ 
                          color: '#666',
                          fontSize: '0.875rem',
                          fontStyle: 'italic'
                        }}
                      >
                        Unassigned
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ minWidth: 160, width: 160 }} align="center">
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
                          title="View Details"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(lead)}
                          size="small"
                          title="Edit Lead"
                        >
                          <EditIcon />
                        </IconButton>
                        <Tooltip title={lead.score ? "Re-score with AI" : "Score with AI & Auto-assign"} arrow>
                          <IconButton
                            color="warning"
                            onClick={() => handleScore(lead.id)}
                            size="small"
                            disabled={loading}
                            sx={{
                              backgroundColor: lead.score ? '#fff3e0' : '#e3f2fd',
                              '&:hover': {
                                backgroundColor: lead.score ? '#ffcc02' : '#1976d2',
                                color: 'white'
                              }
                            }}
                          >
                            <AutoAwesomeIcon />
                          </IconButton>
                        </Tooltip>
                        <IconButton
                          color="error"
                          onClick={() => setDeleteDialog({ open: true, leadId: lead.id })}
                          size="small"
                          title="Delete Lead"
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
              
              {/* Score and Assignment Section */}
              <Box sx={{ mt: 2, mb: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 1, color: '#0176d3' }}>AI Analysis & Assignment</Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                  <Typography variant="body1"><strong>AI Score:</strong></Typography>
                  {viewDialog.lead.score != null ? (
                    <Chip 
                      label={viewDialog.lead.score} 
                      color={viewDialog.lead.score >= 70 ? 'success' : viewDialog.lead.score >= 40 ? 'warning' : 'error'}
                      size="small"
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">Not scored yet</Typography>
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Typography variant="body1"><strong>Assigned To:</strong></Typography>
                  {viewDialog.lead.assignedTo ? (
                    <Typography
                      variant="body2"
                      sx={{
                        color: getAssignmentStyle(viewDialog.lead.assignedTo).textColor,
                        fontWeight: 600,
                        fontSize: '0.875rem'
                      }}
                    >
                      {viewDialog.lead.assignedTo}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">Not assigned yet</Typography>
                  )}
                </Box>
              </Box>
              
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
