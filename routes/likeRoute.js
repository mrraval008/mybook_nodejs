const express = require('express');
const router = express.Router();

const likeController = require('../controllers/likeController');

router.route('/').get(likeController.getAllLikes).post(likeController.createLike);
router.route('/:id').patch(likeController.updateLike).delete(likeController.deleteLike);



module.exports = router;