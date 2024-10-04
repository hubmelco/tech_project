const uuid = require('uuid');
const { PutCommand, QueryCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { TableName, UsernameIndex, runCommand } = require('../utilities/dynamoUtilities');

const CLASS = "user";

async function putUser(username, password) {
    const itemID = uuid.v4();

    const command = new PutCommand({
        TableName,
        Item: {
            class: CLASS,
            itemID,
            username,
            password,
            bio: "",
            genres: []
        },
        ConditionExpression: "attribute_not_exists(ItemID)"
    });
    const response = await runCommand(command);
    return response;
}

async function queryByUsername(username) {
    const UsernameIndex = "username-index";
    const command = new QueryCommand({
        TableName,
        IndexName: UsernameIndex,
        KeyConditionExpression: "#class = :class AND #username = :username",
        ExpressionAttributeNames: {
            "#class": "class",
            "#username": "username"
        },
        ExpressionAttributeValues: {
            ":class": CLASS,
            ":username": username
        }
    });
    const response = await runCommand(command);
    return response;
}

async function queryById(userId) {
    const command = new QueryCommand({
        TableName,
        KeyConditionExpression: "#class = :class AND itemID = :itemID",
        ExpressionAttributeNames: {
            "#class": "class"
        },
        ExpressionAttributeValues: {
            ":class": CLASS,
            ":itemID": userId
        }
    });
    const response = await runCommand(command);
    return response;
}

async function updateUser(userId, requestBody) {
    const command = new UpdateCommand({
        TableName,
        Key: {
            class: CLASS,
            itemID: userId
        },
        UpdateExpression: "set #username = :username, #bio = :bio, #genres = :genres",
        ExpressionAttributeNames: {
            "#username": "username",
            "#bio": "bio",
            "#genres": "genres"
        },
        ExpressionAttributeValues: {
            ":username": requestBody.username,
            ":bio": requestBody.bio,
            ":genres": requestBody.genres
        },
        ReturnValues: "ALL_NEW"
    });
    
    const response = await runCommand(command);
    return response;
}

module.exports = {
    putUser,
    queryById,
    queryByUsername,
    updateUser
};