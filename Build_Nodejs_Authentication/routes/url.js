const express=require('express')
const router=express.Router();
const {generateURL,OrginalID,AnalyticsURL}=require('../Controllers/url')

router.post('/', generateURL)

router.get('/analytics/:shortID',AnalyticsURL)

router.get('/:shortID',OrginalID)

module.exports=router;