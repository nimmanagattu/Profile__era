const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Lead = require('./models/Lead');
const helmet = require('helmet');
const nodemailer = require('nodemailer');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

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
const allowedOrigins = [
    'http://localhost:5173', // Vite default
    'http://localhost:3000',
    'https://profileera.com',
    'https://www.profileera.com'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    allowedHeaders: ['Content-Type', 'x-admin-api-key']
}));

app.use(express.json());

// Serve uploads as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({
    storage,
    limits: { fileSize: 1 * 1024 * 1024 } // 1MB Limit
});

// 1. Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/profileera';
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
app.post('/api/leads', upload.single('resume'), async (req, res) => {
    try {
        const { name, contact, linkedin, naukri } = req.body;
        const newLead = new Lead({
            name,
            contact,
            linkedin,
            naukri,
            resume: req.file ? req.file.filename : null // Store only filename for easy static access
        });
        await newLead.save();

        // Send Email Notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: `New Lead: ${name}`,
            text: `You have a new lead!\n\nName: ${name}\nContact: ${contact}\nLinkedIn: ${linkedin}\nNaukri: ${naukri}\nResume: ${req.file ? 'Attached' : 'Not provided'}`
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
