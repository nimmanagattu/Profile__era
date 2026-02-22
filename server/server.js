const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Lead = require('./models/Lead');
const helmet = require('helmet');
const nodemailer = require('nodemailer');

const path = require('path');
const fs = require('fs');

const app = express();

// --- Environment Validation (Fail-Fast) ---
const requiredEnv = [
    'PORT', 'MONGO_URI', 'ADMIN_API_KEY',
    'ADMIN_PASSWORD', 'ADMIN_EMAIL', 'ALLOWED_ORIGINS',
    'EMAIL_USER', 'EMAIL_PASS'
];

const validateEnv = () => {
    const missing = requiredEnv.filter(key => !process.env[key]);
    if (missing.length > 0) {
        console.error(`\nFATAL: Missing required environment variables:\n${missing.join(', ')}\n`);
        console.error("Please refer to .env.example for required configuration.\n");
        process.exit(1);
    }
};

validateEnv();
// ------------------------------------------

// Email Transporter Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Security Middleware
app.use(helmet());
app.set('trust proxy', 1); // Trust first proxy (needed for Vercel/Railway)

// CORS Configuration
// CORS Configuration
// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : [];

if (allowedOrigins.length === 0 && process.env.NODE_ENV === 'production') {
    console.warn("WARNING: No ALLOWED_ORIGINS defined in production!");
}

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // Avoid logging full origin list in production for security
            const isDev = process.env.NODE_ENV === 'development';
            console.error(`[CORS] Rejected Origin: ${origin}`);
            if (isDev) {
                console.error(`[CORS] Allowed Origins: ${allowedOrigins.join(', ')}`);
            }
            callback(new Error('Not allowed by CORS'));
        }
    },
    allowedHeaders: ['Content-Type', 'x-admin-api-key'],
    credentials: true
}));

app.use(express.json());

app.use(express.json());

// 1. Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => {
        console.error("MongoDB Connection Error:", err.message);
        if (process.env.NODE_ENV === 'production') {
            process.exit(1); // Kill process in production if DB fails
        }
    });

// 2. Load Modular Admin Routes
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

// 3. API Routes
// Public endpoint to receive form data from frontend
app.post('/api/leads', async (req, res) => {
    try {
        const { name, contact, linkedin, naukri } = req.body;
        const newLead = new Lead({
            name,
            contact,
            linkedin,
            naukri
        });
        await newLead.save();

        // Send Email Notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: `New Lead: ${name}`,
            text: `You have a new lead!\n\nName: ${name}\nContact: ${contact}\nLinkedIn: ${linkedin}\nNaukri: ${naukri}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });

        res.status(201).json({ message: "Lead saved successfully", leadId: newLead._id });
    } catch (error) {
        console.error("Error saving lead:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Alias for legacy compat (optional)
app.post('/api/contact', (req, res) => {
    res.redirect(307, '/api/leads');
});

app.get('/', (req, res) => {
    res.send('ProfileEra Backend is Running');
});

// 4. Start Server
const PORT = process.env.PORT;
if (!PORT) {
    console.error("FATAL: PORT is not defined in environment variables");
    process.exit(1);
}

app.listen(PORT, () => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`Server running on port ${PORT}`);
    }
});
