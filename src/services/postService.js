const { throwIfError } = require('../utilities/dynamoUtilities');
const postDAO = require("../repository/postDAO");
const uuid = require("uuid");

async function createPost(username, text, score, title){
    const post = {class: "post", itemID: uuid.v4(), postedBy: username, description: text, score, title, replies: []};
    const data = await postDAO.sendPost(post);
    throwIfError(data);
    return post;
}

async function seePosts(){
    const posts = await postDAO.scanPosts();
    throwIfError(posts);
    return posts.Items;
}

async function createReply(username, text, id){
    const post = await postDAO.getPost(id);
    if (!post.Item) {
        throw {status: 400, message: "That post doesn't exist"};
    }
    const reply = [{postedBy: username, description: text}];
    const data = await postDAO.sendReply(reply, id);
    throwIfError(data);
    return reply;
}

module.exports = {
    createPost,
    createReply,
    seePosts
};