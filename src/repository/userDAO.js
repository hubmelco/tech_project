const { ScanCommand } = require("@aws-sdk/client-dynamodb");

const tableName = "Technology_Project";
let key = "";
fs.readFile('./src/key.txt', (err, data) => {
    if (err) throw err;
    key = data.toString();
});

async function findUser(username){
    const command = new ScanCommand({
        TableName: tableName,
        FilterExpression: "#username = :username",
        ExpressionAttributeNames: {
            "#username": "username"
        },
        ExpressionAttributeValues: {
            ":username": {S: username}
        }
    })
    try{
        const data = await documentClient.send(command);
        return data.Items[0];
    }
    catch(err){
        console.error(err);
        return false;
    }
}

module.exports = {
    findUser
}