const { nanoid } = require('nanoid');
const URL = require('../models/url');

async function generateURL(req, res) {
    const body = req.body;
    if (!body.url) {
        return res.status(400).json({ error: 'url is required' });
    }

    const shortID = nanoid(8);
    try {
        await URL.create({
            shortId: shortID,
            redirectURL: body.url,
            visitHistory: [],
            createdBy: 'discord-bot'
        });
        return res.json({ 
            shortId: shortID,
            shortURL: `http://localhost:8003/url/${shortID}`
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create short URL' });
    }
}

async function OrginalID(req, res) {
    const shortID = req.params.shortID;
    try {
        const entry = await URL.findOneAndUpdate({
            shortId: shortID
        }, {
            $push: {
                visitHistory: { timestamp: Date.now() }
            }
        });

        if (!entry || !entry.redirectURL) {
            return res.status(404).json({ error: 'URL not found' });
        }

        res.redirect(entry.redirectURL);
    } catch (error) {
        return res.status(500).json({ error: 'Error redirecting' });
    }
}

async function AnalyticsURL(req, res) {
    const shortID = req.params.shortID;
    try {
        const result = await URL.findOne({ shortId: shortID });
        if (!result) {
            return res.status(404).json({ error: 'URL not found' });
        }
        return res.json({
            shortId: shortID,
            originalURL: result.redirectURL,
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory
        });
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching analytics' });
    }
}

module.exports = {
    generateURL,
    OrginalID,
    AnalyticsURL
};
