const express = require('express')
const URL = require('../models/url');
const { restrictTo } = require('../middlewares/auth');
const router = express.Router();

router.get('/', restrictTo(['Normal','admin']), async (req, res) => {
    
    const allurls = await URL.find({ createdBy: req.user._id })
    return res.render('home', {
        urls: allurls
    })
})

router.get('/signup', (req, res) => {
    return res.render('signup')
})

router.get('/login', (req, res) => {
    return res.render('login')
})

router.get('/admin/urls', restrictTo(['admin']), async (req, res) => {
    const allurls = await URL.find({})
    return res.render('home', {
        urls: allurls
    })
})


module.exports = router;