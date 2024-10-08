const { PutCommand, QueryCommand, DeleteCommand, UpdateCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const { TableName, UsernameIndex, CLASS_USER, runCommand } = require('../utilities/dynamoUtilities');

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
            ":class": CLASS_USER
        }
    });
    const response = await runCommand(command);
    return response;
}

async function getUserById(userId) {
    const command = new GetCommand({
        TableName,
        Key: {
            class: CLASS_USER,
            itemID: userId
        }
    });
    const response = await runCommand(command);
    return response;
}

async function updateRole(id, role) {
    const command = new UpdateCommand({
        TableName,
        Key: {
            class: CLASS_USER,
            itemID: id
        },
        UpdateExpression: "set #role = :role",
        ExpressionAttributeNames: {
            "#role": "role"
        },
        ExpressionAttributeValues: {
            ":role": role
        }
    });
    const response = await runCommand(command);
    return response;
}

const deleteUser = async (id) => {
    const command = new DeleteCommand({
        TableName,
        Key: { class: CLASS_USER, itemID: id }
    });
    await runCommand(command);
}

async function updateLike(userID, postID){
    const command = new UpdateCommand({
        TableName,
        Key: {
            class: CLASS_USER,
            itemID: userID
        },
        ExpressionAttributeValues: {
            ":post": postID
        },
        UpdateExpression: "SET liked = list_append(liked, :post)",
        ReturnValues: "UPDATED_NEW"
    });
    return await runCommand(command);
}

async function updateDislike(userID, postID){
    const command = new UpdateCommand({
        TableName,
        Key: {
            class: CLASS_USER,
            itemID: userID
        },
        ExpressionAttributeValues: {
            ":post": postID
        },
        UpdateExpression: "SET disliked = list_append(disliked, :post)",
        ReturnValues: "UPDATED_NEW"
    });
    return await runCommand(command);
}

async function removeLike(index, postID, userID){
    const command = new UpdateCommand({
        TableName,
        Key: {
            class: CLASS_USER,
            itemID: userID
        },
        ExpressionAttributeValues: {
            ":post": postID,
            ":index": index
        },
        UpdateExpression: "DELETE liked[:index]",
        ReturnValues: "UPDATED_NEW"
    });
    return await runCommand(command);
}

async function removeDislike(index, postID, userID){
    const command = new UpdateCommand({
        TableName,
        Key: {
            class: CLASS_USER,
            itemID: userID
        },
        ExpressionAttributeValues: {
            ":post": postID,
            ":index": index
        },
        UpdateExpression: "DELETE disliked[:index]",
        ReturnValues: "UPDATED_NEW"
    });
    return await runCommand(command);
}

module.exports = {
    putUser,
    queryByUsername,
    getUserById,
    updateRole,
    deleteUser,
    updateLike,
    updateDislike,
    removeLike,
    removeDislike
};