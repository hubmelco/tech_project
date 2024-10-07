const { throwIfError } = require('../utilities/dynamoUtilities');
const postDAO = require("../repository/postDAO");

async function createPost(username, text, score, title){
    const post = await postDAO.sendPost(username, text, score, title);
    throwIfError(post);
    return {message: "Post created successfully"};
}

async function updatePost(options) {
    await postDAO.updatePost();
}

async function getPost(id) {
    const post = await postDAO.getPost(id);
    if (!post) {
        throw {status: 400, message: `Post not found with id: ${id}`}
    }
    return post;
}

module.exports = {
    createPost,
    updatePost,
    getPost
};