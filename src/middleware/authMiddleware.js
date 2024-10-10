const jwt = require("jsonwebtoken");
const { getPostById } = require("../services/postService");
const { getUserByUsername } = require("../services/userService");

const authenticate = (req, res, next) => {
    const token = getToken(req);
    if (!token) {
        return res.status(401).json("Unauthorized Access");
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        res.locals.user = user;
        next();
    } catch (err) {
        return res.status(401).json("Unauthorized Access, try relogging");
    }
};

const accountOwnerAuthenticate = async (req, res, next) => {
    const token = getToken(req);
    if (!token) {
        return res.status(401).json("Unauthorized Access");
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);

        const userId = req.params.userId;
        if (userId !== user.itemID) {
            return res.status(401).json("Unauthorized Access - Wrong User");
        }

        res.locals.user = user;
        next();
    } catch (err) {
        return res.status(401).json("Unauthorized Access, try relogging");
    }
};

const postOwnerAuthenticate = async (req, res, next) => {
    const token = getToken(req);
    if (!token) {
        return res.status(401).json("Unauthorized Access");
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);

        const postId = req.params.postId;
        let userId;
        try {
            const post = await getPostById(postId);
            userId = (await getUserByUsername(post.postedBy)).itemID;
        } catch (err) {
            return res.status(err.status).json({ message: err.message });
        }
        if (userId !== user.itemID) {
            return res.status(401).json("Unauthorized Access - Wrong User");
        }

        res.locals.user = user;
        next();
    } catch (err) {
        return res.status(401).json("Unauthorized Access, try relogging");
    }
};

const adminAuthenticate = (req, res, next) => {
    const token = getToken(req);
    if (!token) {
        return res.status(401).json("Unauthorized Access");
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        if (user.role !== "admin") {
            return res.status(401).json({ message: "Privilege too low" });
        }
        res.locals.user = user;
        next();
    } catch (err) {
        return res.status(401).json("Unauthorized Access, try relogging");
    }
};

function getToken(req) {
    const token = req.headers?.authorization && req.headers.authorization.split(" ")[1];
    return token;
}

module.exports = { authenticate, accountOwnerAuthenticate, postOwnerAuthenticate, adminAuthenticate };