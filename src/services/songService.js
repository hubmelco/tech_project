const songDAO = require("../repository/songDAO");


async function getSong(query, type, offset = 0) {
    return await songDAO.getSong(query, type, offset);
}

module.exports = {getSong}