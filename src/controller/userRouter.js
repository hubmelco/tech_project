const express = require('express');
const userService = require('../services/userService');
const { validateUsername, validatePassword } = require('../middleware/userMiddleware');

const userRouter = express.Router();

userRouter.post("/", validateUsername, validatePassword, async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        await userService.register(username, password);
        res.status(201).json({
            message: "User successfully registered"
        });
    } catch (err) {
        handleServiceError(err, res);
    }
});

userRouter.post("/login", validateUsername, validatePassword, async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const token = await userService.login(username, password);
        res.status(200).json({
            token,
            message: "Successfully logged in"
        });
    } catch (err) {
        handleServiceError(err, res);
    }
});

userRouter.put("/:userId", async (req, res) => {
    const userId = req.params.userId;
    const requestBody = req.body;

    try {
        const updatedUser = await userService.updateUser(userId, requestBody);
        res.status(200).json({message: "User has been updated", updatedUser});
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