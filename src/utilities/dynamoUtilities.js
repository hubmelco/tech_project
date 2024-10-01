const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

// Table & Index names
const TableName = "Technology_Project";
const UsernameIndex = "Username-index";

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
    UsernameIndex,
    runCommand
};