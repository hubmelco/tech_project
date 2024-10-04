const { throwIfError } = require('../utilities/dynamoUtilities');
const { sendPost } = require("../repository/postDAO");

async function createPost(username, text, score, title){
    const post = await sendPost(username, text, score, title);
    throwIfError(post);
    return {message: "Post created successfully"};
}

module.exports = {
    createPost
};