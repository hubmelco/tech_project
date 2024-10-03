const express = require('express');
const { createPost } = require('../services/postService');
const { authenticateToken } = require('../middleware/authMiddleware');
const { validateTextBody, validateScore } = require('../middleware/postMiddleware');


const postRouter = express.Router();

postRouter.post("/create", authenticateToken, validateTextBody, validateScore, async (req, res) => {
    //TODO check song title exists in API
    try {
        await createPost(req.user.Username, req.body.Text, req.body.Score, "TTT");
        res.status(201).json({
            messge: "Post successfully created";
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
    postRouter
};