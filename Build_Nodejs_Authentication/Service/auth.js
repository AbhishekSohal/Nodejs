const sessionidToUserMap = new Map();

function setUser(id, user) {
    sessionidToUserMap.set(id, user)
}

function getUser(id) {
    return sessionidToUserMap.get(id);
}

module.exports = { setUser, getUser }    