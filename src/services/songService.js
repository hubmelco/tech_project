const songDAO = require("../repository/songDAO");


async function getSongs(query, type, offset = 0) {
    return await songDAO.getSongs(query, type, offset);
}

module.exports = {getSongs}