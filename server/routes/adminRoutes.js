const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const adminAuth = require('../middleware/adminAuth');

// router.use(adminAuth); // Removed to allow public /login route

// 1. Admin Login (Email/Password)
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email === adminEmail && password === adminPassword) {
        // Return the API key which serves as the "session token" for other routes
        res.json({
            message: "Login successful",
            apiKey: process.env.ADMIN_API_KEY
        });
    } else {
        res.status(401).json({ error: "Invalid email or password" });
    }
});

// 2. Verify Admin API Key
router.get('/verify', adminAuth, (req, res) => {
    res.json({ message: "Admin access verified" });
});

// 3. Get All Leads (Latest First)
router.get('/leads', adminAuth, async (req, res) => {
    try {
        const leads = await Lead.find().sort({ date: -1 });
        const formattedLeads = leads.map(lead => ({
            id: lead._id,
            name: lead.name,
            contact: lead.contact,
            linkedin: lead.linkedin || "Not provided",
            naukri: lead.naukri || "Not provided",
            createdAt: lead.date
        }));
        res.json(formattedLeads);
    } catch (error) {
        res.status(500).json({ error: "Error fetching leads" });
    }
});

// 4. Get Single Lead by ID
router.get('/leads/:id', adminAuth, async (req, res) => {
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
            createdAt: lead.date
        };

        res.json(formResponse);
    } catch (error) {
        res.status(500).json({ error: "Error fetching lead details" });
    }
});

// 5. Delete Lead by ID
router.delete('/leads/:id', adminAuth, async (req, res) => {
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
