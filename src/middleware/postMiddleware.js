const { isValidString } = require("../utilities/stringUtilities");

function validateTextBody(req, res, next) {
    const desc = req.body.Text;

    if(!isValidString(desc)) {
        res.status(400).json({
            message: "Invalid post text"
        });
        return;
    }
    next();
}

function validateScore(req, res, next) {
    const score = req.body.Score;

    if(!isNaN(score) || score < 0 || score > 100) {
        res.status(400).json({
            message: "Invalid score"
        });
        return;
    }
    next();
}


module.exports = {
    validateTextBody,
    validateScore
}