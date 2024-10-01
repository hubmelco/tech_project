const bcrypt = require('bcrypt');

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