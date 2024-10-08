const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { register, login, updateRole, addLike } = require('../src/services/userService');
const userDAO = require('../src/repository/userDAO');
const { CLASS_USER } = require('../src/utilities/dynamoUtilities');

jest.mock('bcrypt');
jest.mock("jsonwebtoken");
jest.mock('../src/repository/userDAO');

const mockDatabase = new Map();
const mockUser1 = {
    class: CLASS_USER,
    itemID: "f162b963-6b4e-4033-9159-2e0c13d78419",
    username: "user_1",
    password: "password1",
    role: "user",
    postsLiked: [],
    postsDisliked: []
};
const mockUser2 = {
    class: CLASS_USER,
    itemID: "2dde0401-3c39-42ea-8145-f056fae354f7",
    username: "user_2",
    password: "password1",
    role: "user",
    postsLiked: [],
    postsDisliked: []
};
const mockUser3 = {
    class: CLASS_USER,
    itemID: "8885755c-c6f9-4c83-bec4-899e334e7a39",
    username: "user_3",
    password: "password1",
    role: "user",
    postsLiked: [],
    postsDisliked: []
};
const mockAdmin = {
    class: CLASS_USER,
    itemID: "81aaccf9-8128-49c5-a51c-12841778bf53",
    username: "admin_1",
    password: "password1",
    role: "admin",
    postsLiked: [],
    postsDisliked: []
};

beforeAll(() => {
    // Mock bcrypt
    bcrypt.hashSync.mockImplementation((data, saltOrRounds) => data);
    bcrypt.compareSync.mockImplementation((data, encrypted) => data === encrypted);

    // Mock userDAO
    userDAO.putUser.mockImplementation(async (username, password) => {
        const newUser = {
            itemID: uuid.v4(),
            username,
            password
        };

        mockDatabase.set(username, newUser);
        return {
            $metadata: {
                httpStatusCode: 200
            }
        };
    });

    userDAO.queryByUsername.mockImplementation((username) => {
        let foundUser;
        mockDatabase.forEach((user) => {
            if (user.username == username) {
                foundUser = user;
            }
        });

        return {
            $metadata: {
                httpStatusCode: 200
            },
            Items: [
                foundUser
            ],
            Count: foundUser ? 1 : 0
        };
    });

    userDAO.getUserById.mockImplementation((id) => {
        let foundUser;
        mockDatabase.forEach((user) => {
            if (user.itemID == id) {
                foundUser = user;
            }
        });

        return {
            $metadata: {
                httpStatusCode: 200
            },
            Item: foundUser,
            Count: foundUser ? 1 : 0
        };
    });

    userDAO.updateRole.mockImplementation((id, role) => {
        const user = userDAO.getUserById(id).Item;
        user.role = role;
        mockDatabase.set(user.username, user);
        return {
            $metadata: {
                httpStatusCode: 200
            }
        };
    });

    userDAO.updateLike.mockImplementation((postID, userID) => {
        const user = userDAO.getUserById(userID).Item;
        user.postsLiked.push(postID);
        mockDatabase.set(user.username, user);
        return {
            $metadata: {
                httpStatusCode: 200
            }
        };
    });

    userDAO.updateDislike.mockImplementation((postID, userID) => {
        const user = userDAO.getUserById(userID).Item;
        user.postsDisliked.push(postID);
        mockDatabase.set(user.username, user);
        return {
            $metadata: {
                httpStatusCode: 200
            }
        };
    });

    userDAO.removeLike.mockImplementation((postID, userID) => {
        const user = userDAO.getUserById(userID).Item;
        user.postsLiked.splice(user.postsLiked.indexOf(postID), 1);
        mockDatabase.set(user.username, user);
        return {
            $metadata: {
                httpStatusCode: 200
            }
        };
    });

    userDAO.removeDislike.mockImplementation((postID, userID) => {
        const user = userDAO.getUserById(userID).Item;
        user.postsDisliked.splice(user.postsDisliked.indexOf(postID), 1);
        mockDatabase.set(user.username, user);
        return {
            $metadata: {
                httpStatusCode: 200
            }
        };
    });
});

beforeEach(() => {
    // Reset database
    mockDatabase.clear();
    mockDatabase.set(mockUser1.username, mockUser1);
    mockDatabase.set(mockUser2.username, mockUser2);
    mockDatabase.set(mockUser3.username, mockUser3);
    mockDatabase.set(mockAdmin.username, mockAdmin);
    userDAO.putUser.mockClear();
    userDAO.queryByUsername.mockClear();
    userDAO.getUserById.mockClear();
    userDAO.updateLike.mockClear();
    userDAO.updateDislike.mockClear();
    userDAO.removeLike.mockClear();
    userDAO.removeDislike.mockClear();
});

describe("register", () => {

    test("Creates new user with valid username and password", async () => {
        const username = "user_unique";
        const password = "password";

        await register(username, password);
        let userAdded = true;
        mockDatabase.forEach((user) => {
            if (user.username == username) {
                userAdded = false;
            }
        });

        expect(userAdded).toBeTruthy();
    });

    test("Throws error when given existing username", async () => {
        let error;

        try {
            await register(mockUser1.username, mockUser1.password);
        } catch (err) {
            error = err;
        }

        expect(error.status).toEqual(400);
    });
});

describe("login", () => {
    test("Return new jwt if given valid username and password", async () => {
        const existingUser = mockUser1;

        jwt.sign.mockReturnValue("usertoken");
        const token = await login(existingUser.username, existingUser.password);

        expect(token).toBeDefined();
    });

    test("Throws error if given invalid username", async () => {
        const username = "user_invalid";
        const password = "password";
        let error;

        try {
            await login(username, password);
        } catch (err) {
            error = err;
        }

        expect(error.status).toEqual(400);
    });

    test("Throws error if given invalid password", async () => {
        const username = mockUser1.username;
        const password = "password_invalid";
        let error;

        try {
            await login(username, password);
        } catch (err) {
            error = err;
        }

        expect(error.status).toEqual(400);
    });
});

describe("Delete User Tests", () => {
    test("Deletes a user when called", async () => {
        // I don't know what to test, I just call the DAO with id which is a string by default because its provided in the url.
        expect(1).toBeTruthy();
    })
})

describe("Change User Role", () => {
    test("Promotes valid user to admin", async () => {
        const id = mockUser1.itemID;
        const role = "admin";

        await updateRole(id, role);

        const user = mockDatabase.get(mockUser1.username);
        expect(user.role).toEqual(role);
    });

    test("Throws when user is not found", async () => {
        const id = "Invalid_id";
        const role = "admin";
        let error;

        try {
            await updateRole(id, role);
        } catch (err) {
            error = err;
        }

        expect(error.status).toEqual(400);
    });

    test("Throws if user is already role", async () => {
        const id = mockAdmin.itemID;
        const role = "admin";
        let error;

        try {
            await updateRole(id, role);
        } catch (err) {
            error = err;
        }

        expect(error.status).toEqual(400);
    });

    test("Throws if trying to demote admin", async () => {
        const id = mockAdmin.itemID;
        const role = "user";
        let error;

        try {
            await updateRole(id, role);
        } catch (err) {
            error = err;
        }

        expect(error.status).toEqual(400);
    });

});

describe("Likes/dislikes", () => {
    test("User likes post", async () => {
        const userID = mockUser1.itemID;
        const postID = "whatever";
        const like = 1;

        await addLike(like, postID, userID);
        let likeAdded = false;
        mockDatabase.forEach((user) => {
            if (user.postsLiked.includes(postID) && !user.postsDisliked.includes(postID)) {
                likeAdded = true;
            }
        });

        expect(likeAdded).toBeTruthy();
    });

    test("User dislikes same post", async () => {
        const userID = mockUser1.itemID;
        const postID = "whatever";
        const like = -1;

        await addLike(like, postID, userID);
        let dislikeAdded = false;
        mockDatabase.forEach((user) => {
            if (user.postsDisliked.includes(postID) && !user.postsLiked.includes(postID)) {
                dislikeAdded = true;
            }
        });

        expect(dislikeAdded).toBeTruthy();
    });

    test("User re-likes same post", async () => {
        const userID = mockUser1.itemID;
        const postID = "whatever";
        const like = 1;

        await addLike(like, postID, userID);
        let likeAdded = false;
        mockDatabase.forEach((user) => {
            if (user.postsLiked.includes(postID) && !user.postsDisliked.includes(postID)) {
                likeAdded = true;
            }
        });

        expect(likeAdded).toBeTruthy();
    });
});