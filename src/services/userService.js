const bcrypt = require('bcrypt');
const { putUser, queryByUsername } = require('../repository/userDAO');
const { throwIfError } = require('../utilities/dynamoUtilities');
const { createToken } = require('../utilities/jwtUtilities');

async function register(username, password) {
    const rounds = 10;
    password = bcrypt.hashSync(password, rounds);

    const userExists = (await queryByUsername(username)).Count;
    if (userExists) {
        throw {
            name: 400,
            message: "Username already taken"
        };
    }

    const result = await putUser(username, password);
    throwIfError(result);
}

async function login(username, password) {
    const result = await queryByUsername(username);
    throwIfError(result);
    const user = result.Items[0];
    if (user && bcrypt.compareSync(password, user.password)) {
        return createToken(user);
    }

    throw {
        name: 400,
        message: "Invalid username/password"
    }
}

async function getUserByUsername(username) {
    const result = await queryByUsername(username);
    throwIfError(result);
    const foundUser = result?.Item;
    return foundUser;
}

module.exports = {
    register,
    login,
    getUserByUsername
};