const musicModel= require("../models/music.model");
const albumModel= require("../models/album.model")
const {uploadFile}= require("../services/storage.service");
const jwt= require("jsonwebtoken");

async function createMusic(req,res) {

    try {
        const {title, uri: providedUri}= req.body;
        let audioUrl = providedUri;

        if (req.file) {
            const result= await uploadFile(req.file.buffer.toString('base64'))
            audioUrl = result.url;
        }

        if (!audioUrl) {
            return res.status(400).json({ message: "Audio file or audio URL is required" });
        }

        const music= await musicModel.create({
            uri: audioUrl,
            title,
            artist: req.user.id,
        })

        res.status(201).json({
            message:"Music created successfully",
            music: {
                id:music._id,
                uri:music.uri,
                title:music.title,
                artist:music.artist,
            }
        })
    } catch(err) {
        console.error("createMusic error:", err);
        res.status(500).json({ message: err.message || "Failed to create music" });
    }
}

async function createAlbum(req, res) {

        const { title, musics }= req.body;

        const album= await albumModel.create({
            title,
            artist: req.user.id,
            musics: musics,
        })

        res.status(201).json({
            message:"Album created successfully",
            album: {
                id: album._id,
                title: album.title,
                artist: album.artist,
                musics: album.musics,
            }
        })

}

async function getAllMusics(req, res) {

    const musics= await musicModel
    .find()
    .limit(100)
    .populate("artist","username email");

    res.status(200).json({
        musics: musics,
    })
}

async function getAllAlbums(req, res) {
    
    const albums= await albumModel.find().select("title artist").populate("artist", "username email")

    res.status(201).json({
        message:"Albums fetched successfully",
        albums: albums,
    })
}


async function getAlbumById(req, res) {

    const albumId= req.params.albumId;

    const album= await albumModel.findById(albumId).populate("artist", "username email").populate("musics");

    res.status(201).json({
        message:"Albums fetched successfully",
        album: album,
    })
}

module.exports= { createMusic, createAlbum, getAllMusics, getAllAlbums, getAlbumById }