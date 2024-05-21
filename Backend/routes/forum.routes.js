const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forum.controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/posts', forumController.getPosts);
router.post('/posts', upload.single('file'), forumController.addPost);
router.post('/response', upload.single('file'), forumController.addResponse);

module.exports = router;