const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const TableName = "Technology_Project";

const client = new DynamoDBClient({ region: "us-east-2" });
const documentClient = DynamoDBDocumentClient.from(client);

async function runCommand(command) {
    try {
        const data = await documentClient.send(command);
        return data;
    } catch (err) {
        console.error(err);
        return err;
    }
}

module.exports = {
    TableName,
    runCommand
};