const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const adminAuth = require('../middleware/adminAuth');

// Apply admin authentication to all routes in this router
router.use(adminAuth);

// 1. Verify Admin API Key
router.get('/verify', (req, res) => {
    res.json({ message: "Admin access verified" });
});

// 2. Get All Leads (Latest First)
router.get('/leads', async (req, res) => {
    try {
        const leads = await Lead.find().sort({ date: -1 });
        const formattedLeads = leads.map(lead => ({
            id: lead._id,
            name: lead.name,
            contact: lead.contact,
            linkedin: lead.linkedin || "Not provided",
            naukri: lead.naukri || "Not provided",
            resume: lead.resume ? `${req.protocol}://${req.get('host')}/uploads/${lead.resume}` : "No resume uploaded",
            createdAt: lead.date
        }));
        res.json(formattedLeads);
    } catch (error) {
        res.status(500).json({ error: "Error fetching leads" });
    }
});

// 3. Get Single Lead by ID
router.get('/leads/:id', async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) {
            return res.status(404).json({ error: "Lead not found" });
        }

        // Structured form-like JSON response
        const formResponse = {
            id: lead._id,
            name: lead.name,
            contact: lead.contact,
            linkedin: lead.linkedin || "Not provided",
            naukri: lead.naukri || "Not provided",
            resume: lead.resume ? `${req.protocol}://${req.get('host')}/uploads/${lead.resume}` : "No resume uploaded",
            createdAt: lead.date
        };

        res.json(formResponse);
    } catch (error) {
        res.status(500).json({ error: "Error fetching lead details" });
    }
});

// 4. Delete Lead by ID
router.delete('/leads/:id', async (req, res) => {
    try {
        const lead = await Lead.findByIdAndDelete(req.params.id);
        if (!lead) {
            return res.status(404).json({ error: "Lead not found" });
        }
        res.json({ message: "Lead deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting lead" });
    }
});

module.exports = router;
