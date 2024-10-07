const { throwIfError } = require('../utilities/dynamoUtilities');
const postDAO = require("../repository/postDAO");
const uuid = require("uuid");

async function createPost(username, text, score, title){
    const post = {class: "post", itemID: uuid.v4(), by: username, desc: text, score, title, replies: []};
    const data = await postDAO.sendPost(post);
    throwIfError(data);
    return post;
}

async function seePosts(){
    const posts = await postDAO.scanPosts();
    throwIfError(posts);
    return posts;
}

async function createReply(username, text, id){
    const posts = await postDAO.getPost(id);
    if (!posts) {
        throw {status: 400, message: "That post doesn't exist"};
    }
    const reply = [{username, text}];
    const data = await postDAO.sendReply(reply, id);
    throwIfError(data);
    return reply;
}

module.exports = {
    createPost,
    createReply,
    seePosts
};