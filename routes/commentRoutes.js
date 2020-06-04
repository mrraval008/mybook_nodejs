const express = require('express')
const router = express.Router();

const commentController = require('../controllers/commentController');



router.route('/').get(commentController.getAllComments).post(commentController.createComments);

router.route('/:id').get(commentController.getById).patch(commentController.updateComments).delete(commentController.deleteComments);



module.exports = router;