const express = require("express");

const {getSong} = require("../services/songService");

const router = express.Router();

router.get("/", async (req, res) => {
    const {song, artist, type} = req.query;
    let {offset} = req.query;
    if (!type || (type !== "album" && type !== "track")) {
        return res.status(400).json("type must be provided. must be 'album' or 'track'");
    }
    if (!song && !artist) {
        return res.status(400).json({message: "A song or artist must be provided through query params"});
    }
    if (offset) {
        offset = parseInt(offset);
        // Defined but not a number
        if (!offset) {
            return res.status(400).json({message: "Offset must be a number"});
        }
    }
    try {
        const songs = await getSong(song, artist, type, offset);
        res.status(200).json(songs);
    } catch (err) {
        res.status(502).json({message: "The server was acting as a gateway or proxy and received an invalid response from the upstream server"});
    }
})

module.exports = router;