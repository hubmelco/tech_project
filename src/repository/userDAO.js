const uuid = require('uuid');
const { PutCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { TableName, UsernameIndex, runCommand } = require('../utilities/dynamoUtilities');


async function putUser(username, password) {
    const itemID = uuid.v4();

    const command = new PutCommand({
        TableName,
        Item: {
            class: "user",
            itemID,
            username,
            password
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
            ":username": username,
            ":class": "user"
        }
    });
    const response = await runCommand(command);
    return response;
}

module.exports = {
    putUser,
    queryByUsername
};