const express = require('express')
const router = express.Router();


const postController = require('../controllers/postController');
const authController = require('../controllers/authController');
const imageController = require('../controllers/imageController')

router.use(authController.protect)


router.route('/').get(postController.getAllPosts).post(imageController.uploadImages('posts'),postController.createPost)
router.route('/:id').get(postController.getById).patch(imageController.uploadImages('posts'),postController.updatePost).delete(postController.deletePost)


module.exports = router