const bcrypt = require('bcrypt');
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const userDAO  = require('../repository/userDAO');
const { throwIfError } = require('../utilities/dynamoUtilities');

async function register(username, password) {
    const rounds = 10;
    password = bcrypt.hashSync(password, rounds);

    const userExists = (await userDAO.queryByUsername(username)).Count;
    if (userExists) {
        throw {status: 400, message: "Username already taken"};
    }
    const user = {
        class: "user",
        itemID: uuid.v4(),
        username,
        password,
        role: "user"
    }
    const result = await userDAO.putUser(user);
    throwIfError(result);
    delete(user.password);
    return user;
}

async function login(username, password) {
    const result = await userDAO.queryByUsername(username);
    throwIfError(result);
    const user = result.Items[0];
    if (user && bcrypt.compareSync(password, user.password)) {
        return createToken(user);
    }

    throw {
        status: 400,
        message: "Invalid username/password"
    }
}

async function getUserByUsername(username) {
    const result = await userDAO.queryByUsername(username);
    throwIfError(result);
    const foundUser = result?.Item;
    return foundUser;
}

const deleteUser = async (id) => {
    // Maybe add user exist check here, but not needed since dynamo wont error out with a not found id
    await userDAO.deleteUser(id);
}

function createToken(user) {
    // Delete unneccesarry attributes as needed here
    delete(user.password);

    const token = jwt.sign(user, process.env.JWT_SECRET, {expiresIn: "1d"});
    return token;
}

module.exports = {
    register,
    login,
    getUserByUsername,
    deleteUser
};