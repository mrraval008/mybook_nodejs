const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const imageController = require('../controllers/imageController')

router.post("/signUp",authController.signUp);
router.post("/logIn",authController.logIn);

router.get("/isLoggedIn",authController.isLoggedIn)

router.get('/chatRooms',userController.getChatRoom)

router.route('/').get(userController.getAllUsers)
router.route('/:slug').get(userController.getUser).post(imageController.uploadImages('users'), userController.updateUser)



module.exports = router