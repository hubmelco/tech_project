const jwt = require("jsonwebtoken");
const fs = require('fs');

async function authenticateToken(req, res, next){
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token){
        res.status(401).json({message: "You must sign in first"});
    }
    else{
        req.user = await decodeJWT(token);
        next();
    }
}

async function authenticateAdminToken(req, res, next){
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token){
        res.status(401).json({message: "You must sign in first"});
    }
    else{
        const user = await decodeJWT(token);
        if (!user || user.role !== "Admin"){
            res.status(403).json({message: "Admin only access"});
            return;
        }
        req.user = user;
        next();
    }
}

async function decodeJWT(token){
    try{
        const user = jwt.verify(token, key)
        return user;
    }catch(err){
        console.error(err);
    }
}

module.exports = {
    authenticateToken,
    authenticateAdminToken
}