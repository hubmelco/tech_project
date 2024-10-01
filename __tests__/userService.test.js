const uuid = require('uuid');
const { register } = require('../src/services/userService');
const userDAO = require('../src/repository/userDAO');

jest.mock('../src/repository/userDAO');

const mockDatabase = new Map();
const mockUser1 = {
    ItemID: "f162b963-6b4e-4033-9159-2e0c13d78419",
    Username: "user_1",
    Password: "password1"
};
const mockUser2 = {
    ItemID: "2dde0401-3c39-42ea-8145-f056fae354f7",
    Username: "user_1",
    Password: "password1"
};
const mockUser3 = {
    ItemID: "8885755c-c6f9-4c83-bec4-899e334e7a39",
    Username: "user_1",
    Password: "password1"
};

describe("register", () => {
    beforeAll(() => {
        // Mock userDAO
        userDAO.putUser.mockImplementation(async (Username, Password) => {
            const newUser = {
                ItemID: uuid.v4(),
                Username,
                Password
            };

            mockDatabase.set(Username, newUser);
        });

        userDAO.queryByUsername.mockImplementation((Username) => {
            let foundUser = false;
            mockDatabase.forEach((user) => {
                if (user.Username == Username) {
                    foundUser = true;
                }
            });

            return {
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