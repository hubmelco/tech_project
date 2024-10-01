const { queryByUsername } = require("../repository/getUserDAO");


async function getUserByUsername(req, res) {
    const username = req.body.username;
    const result = await queryByUsername(username);
    const statusCode = result?.$metadata?.httpStatusCode;
    const foundUser = result?.Item;
    if (statusCode == 200) {
        res.status(statusCode).json({
            message: "User Found",
            data: foundUser
        });
    } else {
        res.status(statusCode).send();
    }
}

module.exports = {
    getUserByUsername
}