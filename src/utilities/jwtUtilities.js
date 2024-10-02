const jwt = require('jsonwebtoken');

async function createToken(user) {
    const token = jwt.sign({
        id: user.id,
        username: user.username,
        role: user.role,
        favorites: user.favorites
    },
        key,
        {
            expiresIn: "50m",
        }
    );
    return token;
}

module.exports = {
    createToken
}