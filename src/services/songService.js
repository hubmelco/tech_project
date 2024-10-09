const songDAO = require("../repository/songDAO");


async function getSong(title, artist, type, offset = 0) {
    return await songDAO.getSong(title, artist, type, offset);
}

module.exports = {getSong}