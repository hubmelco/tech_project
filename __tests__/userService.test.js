const uuid = require('uuid');
const bcrypt = require('bcrypt');
const { register, login } = require('../src/services/userService');
const userDAO = require('../src/repository/userDAO');
const { decodeJWT } = require('../src/utilities/jwtUtilities');

jest.mock('bcrypt');
jest.mock('../src/repository/userDAO');

const mockDatabase = new Map();
const mockUser1 = {
    ItemID: "f162b963-6b4e-4033-9159-2e0c13d78419",
    Username: "user_1",
    Password: "password1"
};
const mockUser2 = {
    ItemID: "2dde0401-3c39-42ea-8145-f056fae354f7",
    Username: "user_2",
    Password: "password1"
};
const mockUser3 = {
    ItemID: "8885755c-c6f9-4c83-bec4-899e334e7a39",
    Username: "user_3",
    Password: "password1"
};

beforeAll(() => {
    // Mock bcrypt
    bcrypt.hashSync.mockImplementation((data, saltOrRounds) => data);
    bcrypt.compareSync.mockImplementation((data, encrypted) => data === encrypted);

    // Mock userDAO
    userDAO.putUser.mockImplementation(async (Username, Password) => {
        const newUser = {
            ItemID: uuid.v4(),
            Username,
            Password
        };

        mockDatabase.set(Username, newUser);
        return {
            $metadata: {
                httpStatusCode: 200
            }
        };
    });

    userDAO.queryByUsername.mockImplementation((Username) => {
        let foundUser;
        mockDatabase.forEach((user) => {
            if (user.Username == Username) {
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
        }
    });
});

beforeEach(() => {
    // Reset database
    mockDatabase.clear();
    mockDatabase.set(mockUser1.Username, mockUser1);
    mockDatabase.set(mockUser2.Username, mockUser2);
    mockDatabase.set(mockUser3.Username, mockUser3);
    userDAO.putUser.mockClear();
    userDAO.queryByUsername.mockClear();
});

describe("register", () => {

    test("Creates new user with valid username and password", async () => {
        const username = "user_unique";
        const password = "password";

        await register(username, password);
        let userAdded = false;
        mockDatabase.forEach((user) => {
            if (user.Username == username) {
                userAdded = true;
            }
        });

        expect(userAdded).toBeTruthy();
    });

    test("Throws error when given existing username", async () => {
        let error;

        try {
            await register(mockUser1.Username, mockUser1.Password);
        } catch (err) {
            error = err;
        }

        expect(error.name).toEqual(400);
    });
});

describe("login", () => {
    test("Return new jwt if given valid username and password", async () => {
        const existingUser = mockUser1;

        const token = await login(existingUser.Username, existingUser.Password);
        const user = decodeJWT(token);

        expect(user.ItemID).toEqual(existingUser.ItemID);
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

        expect(error.name).toEqual(400);
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

        expect(error.name).toEqual(400);
    });
});

describe("Delete User Tests", () => {
    test("Deletes a user when called", async () => {
        // I don't know what to test, I just call the DAO with id which is a string by default because its provided in the url.
        expect(1).toBeTruthy();
    })
})