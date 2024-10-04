const { PutCommand, QueryCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { TableName, UsernameIndex, runCommand } = require('../utilities/dynamoUtilities');

const CLASS = "user";

async function putUser(Item) {
    const command = new PutCommand({
        TableName,
        Item,
        ConditionExpression: "attribute_not_exists(itemID)"
    });
    const response = await runCommand(command);
    return response;
}

async function queryByUsername(username) {
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
            ":class": CLASS
        }
    });
    const response = await runCommand(command);
    return response;
}

const deleteUser = async (id) => {
    const command = new DeleteCommand({
        TableName,
        Key: {class: CLASS, itemID: id}
    })
    await runCommand(command);
}

module.exports = {
    putUser,
    queryByUsername,
    deleteUser
};