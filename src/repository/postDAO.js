const uuid = require("uuid");
const { PutCommand, GetCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { TableName, CLASS_POST, runCommand, CLASS_USER } = require('../utilities/dynamoUtilities');

async function getPost(id) {
    const command = new GetCommand({
        TableName,
        Key: { class: CLASS_POST, itemID: id }
    });
    return await runCommand(command);
}

async function sendPost(username, text, score, title) {
    const command = new PutCommand({
        TableName,
        Item: { class: CLASS_POST, itemID: uuid.v4(), by: username, desc: text, score, title }
    });
    return await runCommand(command);
}

async function deletePost(id) {
    const command = new DeleteCommand({
        TableName,
        Key: { class: CLASS_USER, itemID: id }
    });
    return await runCommand(command);
}

module.exports = {
    getPost,
    sendPost
};