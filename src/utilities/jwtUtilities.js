const jwt = require('jsonwebtoken');
const fs = require('fs');

let key = "";
fs.readFile('../key.txt', (err, data) => {
    if (err) throw err;
    key = data.toString();
});

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