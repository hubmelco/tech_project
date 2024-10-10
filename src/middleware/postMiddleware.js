const { validateBody } = require("../utilities/routerUtilities");
const { isValidString } = require("../utilities/stringUtilities");

function validateTitle(required = true) {
    return validateBody("title", (title) => isValidString(title), required);
}

function validateScore(required = true) {
    const isValidScore = (score) => !isNaN(score) && score >= 0 && score <= 100;
    return validateBody("score", isValidScore, required);
}

function validateTextBody(required = true) {
    return validateBody("text", (text) => isValidString(text), required);
}

module.exports = {
    validateTitle,
    validateScore,
    validateTextBody
}