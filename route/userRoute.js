const express=require('express')
const authController=require('../controller/authController');

const router=express.Router();

router.post('/register',authController.register)


router.post('/login',authController.logIn)

router.post('/sendCode', authController.forgotPassword);
router.post('/verify',authController.verifyOTP)
router.patch('/reset',authController.protect,authController.resetPassword)
router.get('/logout', authController.logOut);

//for Admins only 
router.get('/all',
    authController.protect,
    authController.restrictTo(),
    authController.getAllUsers
);

module.exports=router;
