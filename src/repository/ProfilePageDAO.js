const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    UpdateCommand,
    DeleteCommand,
    ScanCommand,
    QueryCommand
} = require('@aws-sdk/lib-dynamodb');

//const logger = require('../util/logger');

const client = new DynamoDBClient({region: "us-west-1"});

const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "Technology_Project";

// UPDATE
async function updateUser(user) {
    const command = new UpdateCommand({
        TableName,
        Key: {
            ItemID: user.ItemID
        },
        UpdateExpression: "set #username = :username, #bio = :bio, #genres = :genres",
        ExpressionAttributeNames: {
            "#username": "username",
            "#bio": "bio",
            "#genres": "genres"
        },
        ExpressionAttributeValues: {
            ":username": user.username,
            ":bio": user.bio,
            ":genres": user.genres
        },
        ReturnValues: "ALL_NEW"
    });
    
    try {
        const data = await documentClient.send(command);
        return data.Attributes;
    } catch(err) {
        logger.error(err);
    }
}

module.exports = {
    updateUser
}