const uuid = require("uuid");
const { PutCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { TableName, runCommand } = require('../utilities/dynamoUtilities');

const CLASS = "post";

async function sendPost(username, text, score, title){
    const command = new PutCommand({
        TableName: TableName,
        Item: {class: "post", itemID: uuid.v4(), by: username, desc: text, score, title}
    });
    return await runCommand(command);
}

async function updatePost() {

}

async function getPost(id) {
    const command = new GetCommand({
        TableName,
        Key: {class: CLASS, itemID: id}
    });
    const {Item} = await runCommand(command);
    return Item;
}

module.exports = {
    sendPost,
    updatePost,
    getPost
};