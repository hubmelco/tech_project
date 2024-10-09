const { PutCommand, ScanCommand, GetCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { TableName, runCommand, CLASS_POST } = require('../utilities/dynamoUtilities');

const sendPost = async (post) => {
    const command = new PutCommand({
        TableName: TableName,
        Item: post
    });
    return await runCommand(command);
};

const sendReply = async (reply, id) => {
    const command = new UpdateCommand({
        TableName: TableName,
        Key: { "class": CLASS_POST, "itemID": id },
        ExpressionAttributeValues: {
            ":reply": reply
        },
        UpdateExpression: "SET replies = list_append(replies, :reply)",
        ReturnValues: "UPDATED_NEW"
    });
    return await runCommand(command);
};

const scanPosts = async () => {
    const command = new ScanCommand({
        TableName: TableName,
        FilterExpression: "#class = :class",
        ExpressionAttributeNames: {
            "#class": "class"
        },
        ExpressionAttributeValues: {
            ":class": CLASS_POST
        }
    })
    const response = await runCommand(command);
    return response;
};

const getPost = async (id) => {
    const command = new GetCommand({
        TableName,
        Key: { class: CLASS_POST, itemID: id }
    });
    return await runCommand(command);
};

const updatePost = async (post) => {
    const command = new UpdateCommand({
        TableName,
        Key: { class: CLASS_POST, itemID: post.itemID },
        UpdateExpression:
            "set title = :title, score = :score, description = :description",
        ExpressionAttributeValues: {
            ":title": post.title,
            ":score": post.score,
            ":description": post.description
        },
        ReturnValues: "UPDATED_NEW"
    });
    return await runCommand(command);
};

const deletePost = async (id) => {
    const command = new DeleteCommand({
        TableName,
        Key: { class: CLASS_POST, itemID: id }
    });
    return await runCommand(command);
};

module.exports = {
    sendPost,
    sendReply,
    getPost,
    scanPosts,
    updatePost,
    deletePost
};