const bcrypt = require('bcrypt');
const uuid = require('uuid');
const { PutCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { TableName, UsernameIndex, runCommand } = require('../utilities/dynamoUtilities');

async function createToken(user){
    const token = jwt.sign({
            id: user.id,
            username: user.username,
            role: user.role,
            favorites: user.favorites
        },
        key,
        {
            expiresIn: "50m",
        }
    );
    return token;
}

async function login(username, password){
    const user = queryUser(username);
    if (user){
        if (bcrypt.compare(password, user.password)){
            return createToken(user);
        }
        return 1;
    }
    return 2;
}


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
    putUser,
    login,
    queryByUsername
};