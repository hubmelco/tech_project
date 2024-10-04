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
    //TODO try to see if better option than scan
    return await postDAO.scanPosts();
}

async function createReply(username, text, id){
    //TODO check if post ID is valid
    /*
    const posts = await postDAO.scanPosts();
    let exists = false;
    for (let i of posts){
        if (i.itemID === id){
            exists = true;
        }
    }
    if (!exists) {
        throw {status: 400, message: "That post doesn't exist"};
    }
        */
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