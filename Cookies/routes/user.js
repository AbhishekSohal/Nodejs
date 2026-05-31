const express = require('express')
const router = express.Router();
const { UserSignup, UserLogin } = require('../Controllers/user')

router.post('/', UserSignup)
router.post('/login', UserLogin)

module.exports = router;