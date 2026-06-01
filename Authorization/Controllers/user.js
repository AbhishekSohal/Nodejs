const User = require("../models/user")
const { v4: uuid } = require('uuid')
const { setUser } = require('../Service/auth')

async function UserSignup(req, res) {
    const { name, email, password } = req.body
    await User.create({
        name,
        email,
        password
    })
    res.redirect('/')
}
async function UserLogin(req, res) {
    const { email, password } = req.body
    const user = await User.findOne({
        email,
        password
    })
    if (!user) return res.render('login', { error: "invalid username or password" })

    const token = setUser(user);
    res.cookie('token', token);
    //res.json({ token });
    res.redirect('/');
}

module.exports = { UserSignup, UserLogin };