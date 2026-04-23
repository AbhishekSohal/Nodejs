const { getUser } = require('../Service/auth')
async function restrictToLoggedinUserOnly(req, res, next) {
    const userUid = req.cookies?.uid;
    if (!userUid) return res.redirect('/login')

    const user = getUser(userUid)
    if (!user) return res.redirect('/login')

    req.user = user// it means we are setting the user in the req object so that we can use it in the next() function and in the controller
    next()
}
async function checkAuthentication(req, res, next) {
    const userUID = req.cookies?.uid;
    const user = getUser(userUID);
    req.user = user;
    next();
}
module.exports = { restrictToLoggedinUserOnly, checkAuthentication }