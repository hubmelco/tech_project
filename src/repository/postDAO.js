const uuid = require("uuid");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");

const tableName = "";

async function sendPost(username, text, score, title){
    const command = new PutCommand({
        TableName: tableName,
        Item: {id: uuid.v4(), by: username, desc: text, score, title}
    });
    try{
        const data = await documentClient.send(command);
        return data;
    }
    catch(err){
        console.error(err);
        return false;
    }
}

module.exports = {
    createPost
}