const { PutCommand, GetCommand, UpdateCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const { TableName, runCommand, flaggedIndex } = require('../utilities/dynamoUtilities');

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

async function updatePostFlag(id, flag) {
    const command = new UpdateCommand({
        TableName,
        Key: {class: CLASS, itemID: id},
        UpdateExpression: "SET #isFlagged = :isFlagged",
        ExpressionAttributeNames: {
            "#isFlagged": "isFlagged" 
        },
        ExpressionAttributeValues: {
            ":isFlagged": flag
        }
    })
    return await runCommand(command);
}

async function getFlaggedPost(isFlagged) {
    const command = new QueryCommand({
        TableName,
        IndexName: "class-isFlagged-index",
        KeyConditionExpression: "#class = :class AND #isFlagged = :isFlagged",
        ExpressionAttributeNames: {
            "#class": "class",
            "#isFlagged": "isFlagged"
        },
        ExpressionAttributeValues: {
            ":isFlagged": isFlagged,
            ":class": CLASS
        }
    })
    const result = await runCommand(command);
    return result
}

module.exports = {
    sendPost,
    updatePost,
    getPost,
    updatePostFlag,
    getFlaggedPost
};