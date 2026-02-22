const adminAuth = (req, res, next) => {
    const apiKey = req.headers['x-admin-api-key'];
    const validApiKey = process.env.ADMIN_API_KEY;

    if (apiKey && apiKey === validApiKey) {
        next();
    } else {
        res.status(401).json({ error: "Unauthorized: Invalid API Key" });
    }
};

module.exports = adminAuth;
