const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { queryByUsername } = require('./src/repository/userDAO');

let key = "";
fs.readFile('./key.txt', (err, data) => {
    if (err) throw err;
    key = data.toString();
});

async function login(username, password){
    const user = queryByUsername(username);
    if (user){
        if (bcrypt.compare(password, user.password)){
            return createToken(user);
        }
        return {message: "Invalid password"};
    }
    return {message: "User does not exist"};
}

async function createToken(user){
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
    login
}