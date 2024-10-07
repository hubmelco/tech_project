const express = require('express');
const userService = require('../services/userService');
const { validateUsername, validatePassword } = require('../middleware/userMiddleware');
const { authenticate, adminAuthenticate } = require("../middleware/auth");

const userRouter = express.Router();

userRouter.post("/", validateUsername, validatePassword, async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const data = await userService.register(username, password);
        res.status(201).json({
            message: "User successfully registered",
            data
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

userRouter.put("/:userId", authenticate, async (req, res) => {
    const userId = req.params.userId;
    const requestBody = req.body;

    if (userId !== res.locals.user.itemID) {
        return res.status(401).json("Unauthorized access - wrong user");
    }

    try {
        const updatedUser = await userService.updateUser(userId, requestBody);
        res.status(200).json({message: "User has been updated", updatedUser});
    } catch (err) {
        handleServiceError(err, res);
    }
});

userRouter.delete("/:id", adminAuthenticate, async (req, res) => {
    const {id} = req.params;
    try {
        await userService.deleteUser(id);
        return res.status(200).json({message: "Deleted user", data: id});
    } catch (err) {
        handleServiceError(err, res);
    }
})

function handleServiceError(error, res) {
    console.error(error);

    const statusCode = error.status;
    if (!statusCode) {
        return res.status(500).json({message: "Internal Server error"})
    }
    const message = error.message;
    return res.status(statusCode).json({message});
}

module.exports = {
    userRouter
};