const uuid = require("uuid");
const { throwIfError } = require('../utilities/dynamoUtilities');
const postDAO = require("../repository/postDAO");


async function createPost(username, description, score, title){
    const post = {
        class: "post",
        itemID: uuid.v4(),
        postedBy: username,
        description,
        score,
        title,
        isFlagged: false
    }
    const result = await postDAO.sendPost(post);
    throwIfError(result);
    delete (post.class)
    return post;
}

async function updatePost(id, post, attributes) {
    Object.keys(attributes).forEach((key) => {
        if (!attributes[key]) {
            attributes[key] = post[key];
        }
    });
    const result = await postDAO.updatePost(id, attributes);
    throwIfError(result);
    return attributes;
}

async function getPost(id) {
    const post = await postDAO.getPost(id);
    if (!post) {
        throw {status: 400, message: `Post not found with id: ${id}`}
    }
    return post;
}

async function updatePostFlag(id, flag) {
    const result = await postDAO.updatePostFlag(id, flag);
    throwIfError(result);
}

module.exports = {
    createPost,
    updatePost,
    getPost,
    updatePostFlag
};