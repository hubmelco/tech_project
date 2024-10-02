async function createPost(username, text, score, title){
    if (score < 0 || score > 100 || !text || !subject){
        return {message: "Invalid post"};
    }
    //connect to api and validate song title and retrieve information on song
    sendPost(username, text, score, title);
    return {message: "Post created successfully"};
}

module.exports = {
    createPost
}