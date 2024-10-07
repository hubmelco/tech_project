const { throwIfError } = require('../utilities/dynamoUtilities');
const postDAO = require("../repository/postDAO");

const createPost = async (username, text, score, title) => {
    const post = await postDAO.sendPost(username, text, score, title);
    throwIfError(post);
    return { message: "Post created successfully" };
}

const getPostById = async (id) => {
    const getPostResult = await postDAO.getPost(id);
    throwIfError(getPostResult);
    const foundPost = getPostResult.Item;
    if (!foundPost) {
        throw {
            status: 400,
            message: "Post not found"
        }
    }

    return foundPost;
}

const deletePost = async (id) => {
    await getPostById(id);

    const deleteResult = await postDAO.deletePost(id);
    throwIfError(deleteResult);
}

module.exports = {
    createPost,
    getPostById,
    deletePost
};