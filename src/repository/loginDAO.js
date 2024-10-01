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