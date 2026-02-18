const adminAuth = (req, res, next) => {
    const apiKey = req.headers['x-admin-api-key'];
    const validApiKey = process.env.ADMIN_API_KEY;

    if (!validApiKey) {
        console.error('FATAL: ADMIN_API_KEY not set in environment variables');
        return res.status(500).json({ error: "Server misconfiguration" });
    }

    if (apiKey && apiKey === validApiKey) {
        next();
    } else {
        res.status(401).json({ error: "Unauthorized: Invalid API Key" });
    }
};

module.exports = adminAuth;
