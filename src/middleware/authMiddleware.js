const jwt = require("jsonwebtoken");
const { decodeJWT, findToken } = require('../utilities/jwtUtilities');

async function authenticateToken(req, res, next){
    const token = findToken(req);
    if (!token){
        res.status(401).json({message: "You must sign in first"});
        return;
    }
    const user = decodeJWT(token);
    req.User = user;
    next();
}

async function authenticateAdminToken(req, res, next){
    const token = findToken(req);
    if (!token){
        res.status(401).json({message: "You must sign in first"});
        return;
    }
    const user = decodeJWT(token);
    if (!user || user.Role !== "Admin"){
        res.status(403).json({message: "Admin only access"});
        return;
    }
    req.User = user;
    next();
}

module.exports = {
    authenticateToken,
    authenticateAdminToken
};