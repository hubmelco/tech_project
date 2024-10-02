const uuid = require("uuid");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");

const tableName = "";

async function createPost(username, text, score){
    if (score < 0 || !text){
        return 1;
    }
    sendPost(username, text, score);
    return 0;
}

async function sendPost(username, text, score){
    const command = new PutCommand({
        TableName: tableName,
        Item: {id: uuid.v4(), by: username, desc: text, score}
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