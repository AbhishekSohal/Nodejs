
const jwt = require('jsonwebtoken')
const secret = '12345'
function setUser(user) {
    const payload = {
        ...user
    }
    return jwt.sign(payload, secret)

}

function getUser(token) {
    if (!token) return null
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }

}

module.exports = { setUser, getUser }    