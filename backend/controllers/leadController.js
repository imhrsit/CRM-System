const Lead = require('../models/Lead');
const aiService = require('../services/aiService');
const AssignmentService = require('../services/assignmentService');

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

// Score a lead using Gemini AI and auto-assign
exports.scoreLead = async (req, res) => {
    try {
        const lead = await Lead.findByPk(req.params.id);
        if (!lead) return res.status(404).json({ error: 'Lead not found' });

        console.log(`\n🎯 Starting scoring process for: ${lead.name} (ID: ${lead.id})`);
        
        // Step 1: Generate AI score
        const score = await aiService.generateLeadScore(lead);
        console.log(`📊 Generated score: ${score}`);
        
        // Step 2: Auto-assign based on score
        const result = AssignmentService.processAssignment(score, lead.name);
        
        // Step 3: Update lead with both score and assignment
        await lead.update({
            score: result.score,
            assignedTo: result.assignedTo
        });

        console.log(`Updated lead in database`);
        console.log(`Process complete!\n`);

        res.json({
            message: result.message,
            leadId: lead.id,
            leadName: lead.name,
            score: result.score,
            assignedTo: result.assignedTo
        });
    } catch (error) {
        console.error('Error scoring lead:', error);
        res.status(500).json({ error: 'Failed to score lead: ' + error.message });
    }
};
