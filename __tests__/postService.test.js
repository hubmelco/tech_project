const { createPost, updatePost, updatePostFlag } = require("../src/services/postService");
const postDAO = require("../src/repository/postDAO");
const uuid = require('uuid');
const {throwIfError} = require("../src/utilities/dynamoUtilities")

jest.mock('../src/repository/postDAO');
jest.mock("../src/utilities/dynamoUtilities");
let mockDatabase = [];
const mockPost1 = {
    itemID: "e7b1998e-77d3-4cad-9955-f20135d840d0 ",
    postBy: "user_1",
    description: "Hello world",
    score: 50,
    title: "Title"
};
const mockPost2 = {
    itemID: "29ee2056-c74e-4537-ac95-6234a2506426 ",
    postBy: "user_2",
    description: "This is a great song",
    score: 100,
    title: "Title"
};

beforeAll(() => {
    // Mock postDAO here
    postDAO.sendPost.mockImplementation(async (item) => {
        mockDatabase.push(item);
        return {
            $metadata: {
                httpStatusCode: 200
            }
        };
    });
});

beforeEach(() => {
    // Reset database
    mockDatabase = [];
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
            if (post.postedBy === username && post.description === text && post.score === score, post.title === title) {
                added = true;
            }
        });
        expect(added).toBeTruthy();
        expect(response).toEqual(mockDatabase[mockDatabase.length - 1]);
    });
});

describe("test suite for updating posts", () => {
    test("Whether unchanged values are assigned correctly", async () => {
        const post = {
            description: "default",
            title: "default",
            score: 100,
            isFlagged: true
        }
        // Pulled from req.body
        const updates = {
            description: undefined,
            score: 80,
            isFlagged: undefined,
            title: "BOO"
        }
        const attributes = await updatePost("filler", post, updates);

        // Merge of post and updates where updates override post where defined and post overrides undefined fields
        const expected = {
            description: post.description,
            title: attributes.title,
            score: attributes.score,
            isFlagged: post.isFlagged
        }

        expect(postDAO.updatePost.mock.calls.length).toBe(1);
        expect(attributes).toEqual(expected);
    });
});

describe("Test suite for flagging posts", () => {
    test("Valid flagging of a post", async () => {
        // id can be any string, no checks
        // retrieved from url param (always a string)
        const id = "random";

        // flag is checked in controller (postman tests)
        const flag = true;

        await updatePostFlag(id, flag);

        // should call the DAO with the same arguments
        expect(postDAO.updatePostFlag.mock.calls.length).toBe(1);
        expect(postDAO.updatePostFlag.mock.calls[0][0]).toBe("random");
        expect(postDAO.updatePostFlag.mock.calls[0][1]).toBe(true);
    })
})