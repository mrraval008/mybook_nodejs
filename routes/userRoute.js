const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');


router.post("/signUp",authController.signUp);
router.post("/logIn",authController.logIn);

router.route('/').get(userController.getAllUsers)


module.exports = router