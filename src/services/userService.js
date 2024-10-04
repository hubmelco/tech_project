const bcrypt = require('bcrypt');
const userDao = require('../repository/userDAO');
const { throwIfError } = require('../utilities/dynamoUtilities');
const { createToken } = require('../utilities/jwtUtilities');

async function register(username, password) {
    const rounds = 10;
    password = bcrypt.hashSync(password, rounds);

    const userExists = (await userDao.queryByUsername(username)).Count;
    if (userExists) {
        throw {
            name: 400,
            message: "Username already taken"
        };
    }

    const result = await userDao.putUser(username, password);
    throwIfError(result);
}

async function login(username, password) {
    const result = await userDao.queryByUsername(username);
    throwIfError(result);
    const user = result.Items[0];
    if (user && bcrypt.compareSync(password, user.Password)) {
        return createToken(user);
    }

    throw {
        name: 400,
        message: "Invalid username/password"
    }
}

async function getUserByUsername(username) {
    const result = await userDao.queryByUsername(username);
    throwIfError(result);
    const foundUser = result?.Item;
    return foundUser;
}

async function getUserById(userId) {
    const result = await userDao.queryById(userId);
    throwIfError(result);
    const foundUser = result?.Items[0];
    return foundUser;
}

async function updateUser(userId, requestBody) {
    const foundUser = await getUserById(userId);

    if (!requestBody.username) {
        requestBody.username = foundUser.username;
    }
    if (!requestBody.bio) {
        requestBody.bio = foundUser.bio;
    }
    if (!requestBody.genres) {
        requestBody.genres = foundUser.genres;
    }

    const result = await userDao.updateUser(userId, requestBody);
    throwIfError(result);
    const updatedUser = result?.Attributes;
    return updatedUser;
}

module.exports = {
    register,
    login,
    getUserByUsername,
    updateUser
};