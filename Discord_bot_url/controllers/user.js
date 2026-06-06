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
    res.redirect('/');//it will redirect to the home page
}

async function getOrCreateUser(discordUser) {
    try {
        let user = await User.findOne({ discordId: discordUser.id });

        if (!user) {
            user = await User.create({
                name: discordUser.username,
                email: `${discordUser.id}@discord.user`,
                password: 'discord-bot-user',
                discordId: discordUser.id,
                role: 'Normal'
            });
        }

        return user;
    } catch (error) {
        console.error('Error with user:', error);
        return null;
    }
}

module.exports = { UserSignup, UserLogin, getOrCreateUser };