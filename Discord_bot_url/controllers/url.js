const { nanoid } = require('nanoid');
const URL = require('../models/url');

async function createShortURL(originalURL, userId = null) {
    if (!originalURL) {
        throw new Error('URL is required');
    }

    const shortID = nanoid(8);
    await URL.create({
        shortId: shortID,
        redirectURL: originalURL,
        visitHistory: [],
        createdBy: userId || null
    });

    const SERVER_BASE_URL = process.env.SERVER_BASE_URL || 'http://localhost:8003';
    return {
        shortId: shortID,
        shortURL: `${SERVER_BASE_URL}/url/${shortID}`
    };
}

async function generateURL(req, res) {
    const body = req.body;
    if (!body.url) {
        return res.status(400).json({ error: 'url is required' });
    }

    const result = await createShortURL(body.url, req.user ? req.user._id : null);
    return res.render('home', { id: result.shortId });

}

async function OrginalID(req, res) {
    const shortID = req.params.shortID;
    const entry = await URL.findOneAndUpdate({
        shortId: shortID
    }, {
        $push: {
            visitHistory: { timestamp: Date.now() }
        }
    });

    if (!entry || !entry.redirectURL) {
        return res.status(404).send({ error: 'URL not found' });
    }

    res.redirect(entry.redirectURL)
}

async function AnalyticsURL(req, res) {
    const shortID = req.params.shortID;
    const result = await URL.findOne({ shortId: shortID });
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory
    });
}

module.exports = {
    createShortURL,
    generateURL,
    OrginalID,
    AnalyticsURL
}
