const profilePageDao = require('../repository/ProfilePageDAO');

async function updateUser(user) {
    const updatedUser = await profilePageDao.updateUser(user);
    return updatedUser;
}

module.exports = {
    updateUser
}