const uuid = require("uuid");
const { PutCommand, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { TableName, runCommand, commandBuilder } = require('../utilities/dynamoUtilities');

const CLASS = "post";

async function sendPost(Item){
    const command = new PutCommand({
        TableName: TableName,
        Item
    });
    return await runCommand(command);
}

async function updatePost(id, attributes) {
    const command = new UpdateCommand({
        TableName,
        Key: {class: CLASS, itemID: id},
        UpdateExpression: "SET #description = :description, #score = :score, #title = :title, #isFlagged = :isFlagged",
        ExpressionAttributeNames: {
            "#description": "description",
            "#score": "score",
            "#title": "title",
            "#isFlagged": "isFlagged" 
        },
        ExpressionAttributeValues: {
            ":description": attributes.description,
            ":title": attributes.title,
            ":score": attributes.score,
            ":isFlagged": attributes.isFlagged
        }
    })
    return await runCommand(command);
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