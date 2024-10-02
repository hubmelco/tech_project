const jwt = require('jsonwebtoken');

// TODO: move key to a secure location
const key = "0254b269-06b1-4dbb-8eb8-1e46cfdfc257";

function createToken(user) {
    const token = jwt.sign(
        {
            ItemID: user.ItemID,
            Username: user.Username,
            Role: user.Role,
            Favorites: user.Favorites
        },
        key,
        {
            expiresIn: "50m"
        }
    );
    return token;
}

function decodeJWT(token) {
    try {
        const user = jwt.verify(token, key);
        return user;
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    createToken,
    decodeJWT
};