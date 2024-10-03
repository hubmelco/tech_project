const express = require('express');
const { createPost } = require('../services/postService');
const { handleServiceError } = require('../utilities/routerUtilities');
const { authenticateToken } = require('../middleware/authMiddleware');
const { validateTextBody, validateScore } = require('../middleware/postMiddleware');


const postRouter = express.Router();

postRouter.post("/create", authenticateToken, validateTextBody, validateScore, async (req, res) => {
    //TODO check song title exists in API
    try {
        await createPost(req.user.Username, req.body.Text, req.body.Score, req.body.Title);
        res.status(201).json({
            messge: "Post successfully created"
        });
    } catch (err) {
        handleServiceError(err, res);
    }
});

module.exports = {
    postRouter
};