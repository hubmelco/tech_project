const { createPost, createReply } = require("../src/services/postService");
const postDAO = require("../src/repository/postDAO");

jest.mock('../src/repository/postDAO');
let mockDatabase = [];
const mockPost1 = {
    class: "post",
    itemID: "e7b1998e-77d3-4cad-9955-f20135d840d0",
    postedBy: "user_1",
    description: "Hello world",
    score: 50,
    title: "Title",
    replies: []
};
const mockPost2 = {
    class: "post",
    itemID: "29ee2056-c74e-4537-ac95-6234a2506426",
    postedBy: "user_2",
    description: "This is a great song",
    score: 100,
    title: "Title",
    replies: []
};

beforeAll(() => {
    // Mock postDAO here
    postDAO.sendPost.mockImplementation(async (post) => {
        mockDatabase.push(post);
        return {
            $metadata: {
                httpStatusCode: 200
            }
        };
    });
    postDAO.getPost.mockImplementation(async (id) => {
        for (let i = 0; i < mockDatabase.length; i++){
            if (mockDatabase[i].itemID == id){
                return {
                    $metadata: {
                        httpStatusCode: 200
                    },
                    Item: mockPost1
                };
            }
        }
        return false;
    });
    postDAO.sendReply.mockImplementation(async (reply, id) => {
        for (let i = 0; i < mockDatabase.length; i++){
            if (mockDatabase[i].itemID == id){
                mockDatabase[i].replies.push(reply);
                return {
                    $metadata: {
                        httpStatusCode: 200
                    }
                };
            }
        }
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
        const username = "Sam";
        const text = "Decent song";
        const score = 69;
        const title = "Hello";

        const response = await createPost(username, text, score, title);
        let added = false;
        mockDatabase.forEach((post) => {
            if (post.class == "post" && post.postedBy == username && post.description == text && post.score == score && post.title == title && post.replies.length == 0) {
                added = true;
            }
        });
        expect(added).toBeTruthy();
    });
});

describe('createReply test', () => {
    it('Successful reply creation', async () => {
        const username = "Mac";
        const text = "I agree";
        const id = "e7b1998e-77d3-4cad-9955-f20135d840d0";

        const response = await createReply(username, text, id);
        let added = false;
        mockDatabase.forEach((post) => {
            if(post.itemID == id && post.replies.length > 0){
                added = true;
            }
        });
        expect(added).toBeTruthy();
    });
});