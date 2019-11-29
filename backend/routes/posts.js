const express = require('express');

const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const fileMiddleware = require('../middleware/multerMiddleware');
const PostsController = require('../controllers/posts');

router.post('/', authMiddleware,
fileMiddleware, PostsController.createPost);

router.put('/:postId', authMiddleware,
fileMiddleware, PostsController.updatePost);

router.get('/:postId', PostsController.getPost);

router.get('/', PostsController.getPosts);

router.delete('/:postId', authMiddleware, PostsController.deletePost);

module.exports = router;
