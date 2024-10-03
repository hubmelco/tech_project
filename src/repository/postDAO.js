const uuid = require("uuid");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const { TableName, runCommand } = require('../utilities/dynamoUtilities');

async function sendPost(username, text, score, title){
    const command = new PutCommand({
        TableName: TableName,
        Item: {ItemID: uuid.v4(), by: username, desc: text, score, title}
    });
    return await runCommand(command);
}

module.exports = {
    sendPost
};