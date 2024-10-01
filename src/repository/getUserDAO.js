const { QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { TableName, UsernameIndex, runCommand } = require('../utilities/dynamoUtilities');

async function queryByUsername(Username) {
    const command = new QueryCommand({
        TableName,
        IndexName: UsernameIndex,
        KeyConditionExpression: "Username = :Username",
        ExpressionAttributeValues: {
            ":Username": Username
        }
    });
    const response = await runCommand(command);
    return response;
}

module.exports = {
    queryByUsername
}