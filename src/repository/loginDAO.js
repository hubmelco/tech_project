const { ScanCommand } = require("@aws-sdk/client-dynamodb");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

let key = "";
fs.readFile('./src/key.txt', (err, data) => {
    if (err) throw err;
    key = data.toString();
});

const tableName = "";

async function login(username, password){
    const user = findUser(username);
    if (user){
        if (bcrypt.compare(password, user.password)){
            return createToken(user);
        }
        return 1;
    }
    return 2;
}

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