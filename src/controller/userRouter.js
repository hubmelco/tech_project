const express = require('express');
const { register } = require('../services/userService');
const { validateUsername, validatePassword } = require('../middleware/userMiddleware');

const userRouter = express.Router();

userRouter.post("/", validateUsername, validatePassword, async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        await register(username, password);
        res.status(201).json({
            messge: "User successfully registered"
        });
    } catch (err) {
        console.error(err);

        let statusCode = err.name;
        let message = err.message;
        if (typeof err.name != "number") {
            statusCode = 500;
            message = "Internal Server Error";
        }

        res.status(statusCode).json({
            message
        });
    }
});

module.exports = {
    userRouter
};