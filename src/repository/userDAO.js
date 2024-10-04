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

async function queryByUsername(Username) {
    const command = new QueryCommand({
        TableName,
        IndexName: "username-index",
        KeyConditionExpression: "Username = :Username",
        ExpressionAttributeValues: {
            ":Username": Username
        }
    });
    const response = await runCommand(command);
    return response;
}

module.exports = {
    putUser,
    queryByUsername
};