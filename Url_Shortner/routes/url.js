const express=require('express')
const router=express.Router();
const {generateURL,OrginalID,AnalyticsURL}=require('../Controllers/url')

router.post('/', generateURL)

router.get('/:shortID',OrginalID)

router.get('/analytics/:shortID',AnalyticsURL)

module.exports=router;