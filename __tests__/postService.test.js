const { createPost } = require("../src/services/postService");
const { sendPost } = require("../src/repository/postDAO");
const uuid = require('uuid');

jest.mock('../src/repository/postDAO');
const mockDatabase = [];
const mockPost1 = {
    ItemID: "e7b1998e-77d3-4cad-9955-f20135d840d0 ",
    Username: "user_1",
    Text: "Hello world",
    Score: 50,
    Title: "Title"
};
const mockPost2 = {
    ItemID: "29ee2056-c74e-4537-ac95-6234a2506426 ",
    Username: "user_2",
    Text: "This is a great song",
    Score: 100,
    Title: "Title"
};

beforeAll(() => {
    // Mock postDAO
    postDAO.sendPost.mockImplementation(async (Username, Text, Score, Title) => {
        const newPost = { ItemID: uuid.v4(), Username, Text, Score, Title };

        mockDatabase.set(Username, newPost);
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
    mockDatabase.push(mockPost1);
    mockDatabase.push(mockPost2);
    postDAO.sendPost.mockClear();
});

describe('createPost test', () => {
    it('Successful post creation', async () => {
        const username = "Same";
        const text = "Decent song";
        const score = 69;
        const title = "Hello";

        const response = await createPost(username, text, score, title);
        let added = false;
        mockDatabase.forEach((post) => {
            if (post.Username == username && post.Text == text && post.Score == score, post.Title == title) {
                added = true;
            }
        });
        expect(added).toBeTruthy();
        expect(response).toEqual({message: "Post created successfully"});
    });
    it('Throws error score too low', async () => {
        try {
            await createPost("Jack", "AWFUL!", -1, "Queen");
        } catch (err) {
            error = err;
        }
        expect(error.name).toEqual(400);
    });
    it('Throws error score too high', async () => {
        try {
            await createPost("Tom", "AWESOME!", 200, "Rolling Stones");
        } catch (err) {
            error = err;
        }
        expect(error.name).toEqual(400);
    });
    it('Throws error no text body', async () => {
        try {
            await createPost("Todd", "", 50, "");
        } catch (err) {
            error = err;
        }
        expect(error.name).toEqual(400);
    });
})