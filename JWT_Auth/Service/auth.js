// in doubt can come is that why in statefull we cannot store cookies in database itself because of security issues and also because of performance issues as we have to query the database every time to check if the cookie is valid or not but in stateless we can store the token in the client side and we can verify the token on the server side without having to query the database every time.


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