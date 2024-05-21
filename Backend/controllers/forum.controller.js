const Post = require('../models/post.model');
const Response = require('../models/response.model');

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({ include: Response });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addPost = async (req, res) => {
    try {
        const { author, role, content } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
        const pdfUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const post = await Post.create({ author, role, content, imageUrl, pdfUrl });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addResponse = async (req, res) => {
    try {
        const { postId, author, role, content } = req.body;
        const imageURL = req.file ? `/uploads/${req.file.filename}` : null;
        const pdfUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const response = await Response.create({ postId, author, role, content, imageURL, pdfUrl });
        res.json(response)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};