const express=require("express");
const router = express.Router();
const authController=require('../controller/auth.controller')
const authMiddleware = require("../middleware/auth.middleware");

router.post('/user/register',authController.registerUser)
router.post('/user/login',authController.loginUser);
router.post('/user/logout',authController.logoutUser);
router.post('/user/checkUser',authMiddleware,authController.checkUser);

module.exports=router;