const Lead = require('../models/Lead');

// Create a new lead
exports.createLead = async (req, res) => {
    try {
        const lead = await Lead.create(req.body);
        res.status(201).json(lead);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all leads
exports.getLeads = async (req, res) => {
    try {
        const leads = await Lead.findAll();
        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single lead by ID
exports.getLeadById = async (req, res) => {
    try {
        const lead = await Lead.findByPk(req.params.id);
        if (!lead) return res.status(404).json({ error: 'Lead not found' });
        res.json(lead);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a lead
exports.updateLead = async (req, res) => {
    try {
        const lead = await Lead.findByPk(req.params.id);
        if (!lead) return res.status(404).json({ error: 'Lead not found' });
        await lead.update(req.body);
        res.json(lead);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a lead
exports.deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findByPk(req.params.id);
        if (!lead) return res.status(404).json({ error: 'Lead not found' });
        await lead.destroy();
        res.json({ message: 'Lead deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
