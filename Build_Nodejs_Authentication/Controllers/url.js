const { nanoid }=require('nanoid')
const URL=require('../models/url');

async function generateURL(req,res){
    const body=req.body
    if(!body.url) return res.status(400).json({error:'url is required'})
    const shortID=nanoid(8);
    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory:[]
    });
    return res.render('home', {id: shortID})
    
    
}

async function OrginalID(req,res){
    const shortID=req.params.shortID;
    const entry= await URL.findOneAndUpdate({
        shortId:shortID
    },{$push:{
        visitHistory:{timestamp:Date.now()}
    }});

    if (!entry || !entry.redirectURL) {
        return res.status(404).send({error: 'URL not found'});
    }

    res.redirect(entry.redirectURL)
}

async function AnalyticsURL(req, res) {
    const shortID = req.params.shortID;
    const result = await URL.findOne({shortId:shortID});
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory
    });
}




module.exports={
    generateURL,
    OrginalID,
    AnalyticsURL
}