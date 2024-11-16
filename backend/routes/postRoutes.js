const express = require('express');
const { createPost, getPosts, getUserPosts, editPost, deletePost, getPostById} = require('../controllers/postController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const router = express.Router();

router.get('/', authenticateUser, getPosts);
router.get('/user-posts', authenticateUser, getUserPosts);
router.post('/', authenticateUser, createPost);
router.put('/:id', authenticateUser, editPost);
router.delete('/:id', authenticateUser, deletePost);
// Agrega esta línea para obtener un post por su ID
router.get('/:postId', authenticateUser, getPostById);

module.exports = router;
