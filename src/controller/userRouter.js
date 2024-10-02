const express = require('express');
const { register, login } = require('../services/userService');
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
        handleServiceError(err, res);
    }
});

userRouter.post("/login", validateUsername, validatePassword, async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const token = await login(username, password);
        res.status(200).json({
            token,
            message: "Successfully logged in"
        });
    } catch (err) {
        handleServiceError(err, res);
    }
});

function handleServiceError(error, res) {
    console.error(error);

    let statusCode = error.name;
    let message = error.message;
    if (typeof error.name != "number") {
        statusCode = 500;
        message = "Internal Server Error";
    }

    res.status(statusCode).json({
        message
    });
}

module.exports = {
    userRouter
};