const { isValidString } = require("../utilities/stringUtilities");

function validateUsername(req, res, next) {
    const username = req.body.username;

    if(!isValidString(username)) {
        res.status(400).json({
            message: "Invalid username"
        });
        return;
    }
    next();
}

function validatePassword(req, res, next) {
    const password = req.body.password;

    if(!isValidString(password)) {
        res.status(400).json({
            message: "Invalid password"
        });
        return;
    }
    next();
}

module.exports = {
    validateUsername,
    validatePassword
};