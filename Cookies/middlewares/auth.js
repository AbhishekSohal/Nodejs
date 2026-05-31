const { getUser } = require('../Service/auth')
async function restrictToLoggedinUserOnly(req, res, next) {
    const userUid = req.headers?.['authorization'];
    // now we have to split it as in the header we will get it as Bearer token so we have to split it and get the token only
    const token = userUid?.split('Bearer ')[1];
    if (!token) return res.redirect('/login')

    const user = getUser(token)
    if (!user) return res.redirect('/login')

    req.user = user// it means we are setting the user in the req object so that we can use it in the next() function and in the controller
    next()
}
async function checkAuthentication(req, res, next) {
    const userUID = req.headers?.['authorization'];
    const token = userUID?.split('Bearer ')[1];
    const user = getUser(token);
    req.user = user;
    next();
}
module.exports = { restrictToLoggedinUserOnly, checkAuthentication }