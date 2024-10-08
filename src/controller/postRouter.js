const express = require('express');
const postService = require('../services/postService');
const userService = require('../services/userService');
const { handleServiceError } = require('../utilities/routerUtilities');
const { authenticate } = require("../middleware/authMiddleware");
const { validateTextBody, validateScore } = require('../middleware/postMiddleware');


const postRouter = express.Router();

postRouter.post("/", authenticate, validateTextBody, validateScore, async (req, res) => {
    //TODO check song title exists in API
    try {
        await postService.createPost(res.locals.user.username, req.body.text, req.body.score, req.body.title);
        res.status(200).json({
            message: "Post successfully created"
        });
    } catch (err) {
        handleServiceError(err, res);
    }
});

postRouter.get("/", async (req, res) => {
    //TODO check song title exists in API
    try {
        const posts = await postService.seePosts();
        res.status(200).json({
            Posts: posts
        });
    } catch (err) {
        handleServiceError(err, res);
    }
});

postRouter.patch("/:id/replies", authenticate, validateTextBody, async (req, res) => {
    //TODO check song title exists in API
    try {
        await postService.createReply(res.locals.user.username, req.body.text, req.params.id);
        res.status(200).json({
            message: "Reply successfully created"
        });
    } catch (err) {
        handleServiceError(err, res);
    }
});

module.exports = {
    postRouter
};