const bcrypt = require('bcrypt');
const { putUser } = require("../repository/registerDAO");
const { queryByUsername } = require('../repository/getUserDAO');

async function register(req, res) {
    const username = req.body.username;
    let password = req.body.password;
    const rounds = 10;
    password = await bcrypt.hash(password, rounds);

    const userExists = (await queryByUsername(username)).Count;
    if(userExists) {
        res.status(400).json({
            message: "Username already taken"
        });
        return;
    }

    const result = await putUser(username, password);
    const statusCode = result?.$metadata?.httpStatusCode;
    if (statusCode == 200) {
        res.status(201).json({
            message: "User successfully registered"
        });
    } else {
        res.status(statusCode).send();
    }
}

module.exports = {
    register
};