const express = require('express');
const postService = require('../services/postService');
const { register, login, deleteUser, updateRole, addLike } = require('../services/userService');
const { validateUsername, validatePassword, validateRole, validateLike } = require('../middleware/userMiddleware');
const { adminAuthenticate, authenticate } = require("../middleware/authMiddleware");
const { handleServiceError } = require("../utilities/routerUtilities");

const userRouter = express.Router();

userRouter.post("/", validateUsername, validatePassword, async (req, res) => {
    const { username, password } = req.body;

    try {
        const data = await register(username, password);
        res.status(201).json({
            message: "User successfully registered",
            data
        });
    } catch (err) {
        handleServiceError(err, res);
    }
});

userRouter.post("/login", validateUsername, validatePassword, async (req, res) => {
    const { username, password } = req.body;

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

userRouter.delete("/:id", adminAuthenticate, async (req, res) => {
    const { id } = req.params;
    try {
        await deleteUser(id);
        return res.status(200).json({ message: "Deleted user", data: id });
    } catch (err) {
        handleServiceError(err, res);
    }
});

userRouter.patch("/:id/role", validateRole, adminAuthenticate, async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    try {
        await updateRole(id, role);
        return res.status(200).json({ message: `User role changed to ${role}` });
    } catch (err) {
        handleServiceError(err, res);
    }
});

userRouter.patch("/:id/like", authenticate, validateLike, async (req, res) => {
    //TODO check song title exists in API
    try {
        const like = await addLike(req.body.like, req.params.id, res.locals.user.itemID);
        await postService.checkLike(like, req.params.id);
        res.status(200).json({
            message: "Updated like/dislike ratio on post"
        });
    } catch (err) {
        handleServiceError(err, res);
    }
});

module.exports = {
    userRouter
};