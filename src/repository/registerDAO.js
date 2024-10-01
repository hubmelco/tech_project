const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const uuid = require('uuid');
const { TableName, runCommand } = require('../utilities/dynamoUtilities');

async function putUser(Username, Password) {
    const ItemID = uuid.v4();

    const command = new PutCommand({
        TableName,
        Item: {
            ItemID,
            Username,
            Password
        },
        ConditionExpression: "attribute_not_exists(ItemID)"
    });
    const response = await runCommand(command);
    return response;
}

module.exports = {
    putUser
};