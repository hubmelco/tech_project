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
}

async function updateUser(userId, requestBody) {
    const command = new UpdateCommand({
        TableName,
        Key: {
            class: CLASS_USER,
            itemID: userId
        },
        UpdateExpression: "set #username = :username, #bio = :bio, #genres = :genres",
        ExpressionAttributeNames: {
            "#username": "username",
            "#bio": "bio",
            "#genres": "genres"
        },
        ExpressionAttributeValues: {
            ":username": requestBody.username,
            ":bio": requestBody.bio,
            ":genres": requestBody.genres
        },
        ReturnValues: "ALL_NEW"
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

async function updateLike(postID, userID){
    const command = new UpdateCommand({
        TableName,
        Key: {
            class: CLASS_USER,
            itemID: userID
        },
        ExpressionAttributeValues: {
            ":post": [postID]
        },
        UpdateExpression: "SET postsLiked = list_append(postsLiked, :post)",
        ReturnValues: "UPDATED_NEW"
    });
    return await runCommand(command);
}

async function updateDislike(postID, userID){
    const command = new UpdateCommand({
        TableName,
        Key: {
            class: CLASS_USER,
            itemID: userID
        },
        ExpressionAttributeValues: {
            ":post": [postID]
        },
        UpdateExpression: "SET postsDisliked = list_append(postsDisliked, :post)",
        ReturnValues: "UPDATED_NEW"
    });
    return await runCommand(command);
}

async function removeLike(index, userID){
    const command = new UpdateCommand({
        TableName,
        Key: {
            class: CLASS_USER,
            itemID: userID
        },
        UpdateExpression: "REMOVE postsLiked["+index+"]",
        ReturnValues: "UPDATED_NEW"
    });
    return await runCommand(command);
}

async function removeDislike(index, userID){
    const command = new UpdateCommand({
        TableName,
        Key: {
            class: CLASS_USER,
            itemID: userID
        },
        UpdateExpression: "REMOVE postsDisliked["+index+"]",
        ReturnValues: "UPDATED_NEW"
    });
    return await runCommand(command);
}

module.exports = {
    putUser,
    queryByUsername,
    getUserById,
    updateUser,
    getUserById,
    updateRole,
    deleteUser,
    updateLike,
    updateDislike,
    removeLike,
    removeDislike
};