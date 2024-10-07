const express = require('express');
const { createPost } = require('../services/postService');
const { handleServiceError } = require('../utilities/routerUtilities');
const { authenticate } = require("../middleware/authMiddleware");
const { validateTextBody, validateScore } = require('../middleware/postMiddleware');


const postRouter = express.Router();

postRouter.post("/", authenticate, validateTextBody, validateScore, async (req, res) => {
    //TODO check song title exists in API
    try {
        await createPost(res.locals.user.username, req.body.text, req.body.score, req.body.title);
        res.status(200).json({
            message: "Post successfully created"
        });
    } catch (err) {
        handleServiceError(err, res);
    }
});

postRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await deletePost(id);
        return res.status(200).json({ message: "Deleted post", data: id });
    } catch (err) {
        handleServiceError(err, res);
    }
});

module.exports = {
    postRouter
};