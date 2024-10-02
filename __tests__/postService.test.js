const { createPost } = require("./src/services/postService");
const { sendPost } = require("./src/repository/postDAO");

describe('createPost test', () => {
    it('Create post by Sam on Metallica with a 69 score', async () => {
        const mockPost = jest.mocked(sendPost);
        const response = await createPost("Sam", "These guys are passable", 69, "Metallica");
        expect(mockPost).toHaveBeenCalledWith("Same", "These guys are passable", 69, "Metallica");
        expect(response).toEqual({message: "Post created successfully"});
    });
    it('Create post by Jack on Queen with a -1 score', async () => {
        const response = await createPost("Jack", "AWFUL!", -1, "Queen");
        expect(response).toEqual({message: "Invalid post"});
    });
    it('Create post by Tom on Rolling Stones with a 200 score', async () => {
        const response = await createPost("Tom", "AWESOME!", 200, "Rolling Stones");
        expect(response).toEqual({message: "Invalid post"});
    });
    it('Create post by Todd on nothing and saying nothing with a 50 score', async () => {
        const response = await createPost("Todd", "", 50, "");
        expect(response).toEqual({message: "Invalid post"});
    });
})