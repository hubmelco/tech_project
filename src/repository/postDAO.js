const { PutCommand, ScanCommand, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { TableName, runCommand } = require('../utilities/dynamoUtilities');

const CLASS = "post";

async function sendPost(post){
    const command = new PutCommand({
        TableName: TableName,
        Item: post
    });
    return await runCommand(command);
}

async function scanPosts() {
    const command = new ScanCommand({
        TableName: TableName,
        FilterExpression: "#class = :class",
        ExpressionAttributeNames: {
            "#class": "class"
        },
        ExpressionAttributeValues: {
            ":class": CLASS
        }
    })
    const response = await runCommand(command);
    return response;
}

async function sendReply(reply, id){
    const command = new UpdateCommand({
        TableName: TableName,
        Key: {"class": CLASS, "itemID": id},
        ExpressionAttributeValues: {
            ":reply": reply
        },
        UpdateExpression: "SET replies = list_append(replies, :reply)",
        ReturnValues: "UPDATED_NEW"
    });
    return await runCommand(command);
}

async function getPost(id) {
    const command = new GetCommand({
        TableName,
        Key: {class: CLASS, itemID: id}
    });
    return await runCommand(command);
}

module.exports = {
    sendPost,
    scanPosts,
    sendReply,
    getPost
};