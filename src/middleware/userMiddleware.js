const { isValidBodyProperty } = require("../utilities/routerUtilities");

function validateUsername(req, res, next) {
    if(isValidBodyProperty(req, res, "username")) {
        next();
    }
}

function validatePassword(req, res, next) {
    if(isValidBodyProperty(req, res, "password")) {
        next();
    }
}

function validateRole(req, res, next) {
    if(isValidBodyProperty(req, res, "role")) {
        next();
    }
}

module.exports = {
    validateUsername,
    validatePassword,
    validateRole
};