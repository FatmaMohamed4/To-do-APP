const jwt  = require('jsonwebtoken');
const session = require('express-session')
const User=require('../model/userModel');
const {promisify} =require ('util')
const crypto =require('crypto');
const { sendToEmail } = require('../utilities/Email.js');

// const {sendToEmail} = require('../utilities/OTP/Email.js');




exports.register=async (req,res)=>{
    try{
    const user = await User.create(req.body)
 
        res.status(201).json({
            status:true,
            message:"Sign up Successfully",
            
        })
    }
    catch(err){
        res.status(401).json({
            status:false,
            error:err ,
            
        })
    }
}


exports.logIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (!user || !await user.correctPassword(password, user.password)) {
            return res.status(401).json({
                status: false,
                message: "Invalid email or password"
            });
        } 

        // Set the session flag to true since the user is authenticated
        req.session.authenticated = true;
        req.session.user = user;
        req.session.userId = user._id;

        // console.log(req.session)
        // Now you can proceed to generate token and send response
        let token = jwt.sign({ userId: user._id }, 'E-commerce App# first App', { expiresIn: "90d" });

        res.status(200).json({
            status: true,
            message: "Log in Successfully",
            token: token,
            
        });

    } catch (err) {
        res.status(401).json({
            status: false,
            error: err.message,
        });
        console.log(err);
    }
};

exports.protect= async(req,res,next) =>{
//token from user 
let token ;
if(req.headers.authorization && req.headers.authorization.startsWith("Bearer") ){
    token=req.headers.authorization.split(" ")[1]
}
console.log(token)
if(!token){
    return res.status(404).json({status :false ,message :"please log in"})
}


//verfiy token with secret key
const decodedToken = await promisify (jwt.verify)(token,'E-commerce App# first App') //return id
console.log(decodedToken)
//check user (of token) is exist
const currentUser =await User.findById(decodedToken.userId)


  if(!currentUser){
    return res.status(404).json({
        message : "Sesstion is expired"
    })
  }


  req.user=currentUser
next()
}

exports.restrictTo=()=>{ 
    //Guard 
    return (req,res,next)=>{
        if(!req.user.isAdmin){
            return res.status(403).json({
                status:false,
                message:"you don't have licence to do this action"
            })
        }
        next();
    }

}

exports.forgotPassword =async(req, res)=> {
    try{
    const user = await User.findOne({email:req.body.email})
    if (!user){
        return res.status(404).json({
            status:false,
            message:"Account 't found"
        })
    }

    const otp = await user.generateOtp()
    await user.save({ validateBeforeSave: false });
    sendToEmail(req.body.email,otp)

    res.status(200).json({
        status:true,
        meesage:"otp generated and send to your email" ,
        otp:otp
    })
}catch(err){
    res.status(401).json({
        status:false,
        err
    })
}
}

exports.verifyOTP=async(req,res)=>{
    try{
        const otp=crypto.createHash('sha256').update(req.body.otp).digest('hex');;
        const user = await User.findOne({otp:otp,otpExpires:{ $gt: Date.now() },})
        if(!user){
            return res.status(401).json({
                status:false,
                message:"Otp is n't valid"
            })
        }

        const token = jwt.sign({ userId: user._id }, 'E-commerce App# first App',{expiresIn:"90d"});  
        res.status(200).json({
            status:true,
            messge:"Comfirmed OTP",
            token
        })
    }  
    catch(err){

    }
}

exports.resetPassword = async (req, res) => {

    try {
      const user =req.user;
      user.password=req.body.password
      user.confirmPassword=req.body.confirmPassword
      user.otp=undefined ; 
      user.otpExpires=undefined ;
      user.save({validateBeforeSave:true})
      res.status(200).json({
        status:true,
        user
      })
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllUsers = async (req,res)=>{
    try{
   const users = await User.find()
   if(!users){
    res.status(404).json ({
        msg :"Users not found" ,
        err:err 
    })
   } else{
   res.status(200).json ({
    users :users ,
})
   }
    }
    catch (err){
        res.status(500).json ({
            msg :"Internal server error" ,
            error : err
        })
    }
}

exports.logOut = (req, res) => {
    try {
        // Destroy the session
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            // Redirect or send a response indicating successful logout
            res.status(200).json({ status: true, message: 'Logged out successfully'});
            console.log(req.session)
        });
    } catch (error) {
        console.error('Error in logOut:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};