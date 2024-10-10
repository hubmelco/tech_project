const { throwIfError, CLASS_POST } = require('../utilities/dynamoUtilities');
const postDAO = require("../repository/postDAO");

const uuid = require("uuid");

const createPost = async (username, text, score, title) => {
    const post = { class: CLASS_POST, itemID: uuid.v4(), postedBy: username, description: text, score, title, replies: [] };
    const data = await postDAO.sendPost(post);
    throwIfError(data);
    return post;
}

const createReply = async (username, text, id) => {
    const post = await getPostById(id);
    const reply = [{ postedBy: username, description: text }];
    const data = await postDAO.sendReply(reply, id);
    throwIfError(data);
    return reply;
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

const seePosts = async () => {
    const posts = await postDAO.scanPosts();
    throwIfError(posts);
    return posts.Items;
}

const updatePost = async (id, title, score, description) => {
    const post = await getPostById(id);
    post.title = title ? title : post.title;
    post.score = score ? score : post.score;
    post.description = description ? description : post.description;

    const updateResult = await postDAO.updatePost(post);
    throwIfError(updateResult);
};

const deletePost = async (id) => {
    await getPostById(id);

    const deleteResult = await postDAO.deletePost(id);
    throwIfError(deleteResult);
}

module.exports = {
    createPost,
    createReply,
    getPostById,
    seePosts,
    updatePost,
    deletePost
};