const mongoose=require('mongoose');
const validator=require('validator')
const bcrypt=require('bcryptjs')
const crypto =require('crypto')
const generateOTP=require('otp-generator');
const { type } = require('os');


const userSchema = new mongoose.Schema ({
   fName :{
     type:String, 
     minlength:[3,"fname at least have 8 letters"],
     maxlength:[20,"fname maxiumum have 20 letters"],
     trim:true,
     required :[true,"U must enter yoru first name"] 
   } ,
  //  lName :{
  //   type:String,
  //   minlength:[3,"lname at least have 8 letters"],
  //    maxlength:[20,"lname maxiumum have 20 letters"],
  //   required :[true,"U must enter yoru last name"] 
  //  } ,
   email :{
    type:String,
    validate:[validator.isEmail,"This not a valid Email"],
    unique:[true,"this Email used Before"], 
    required :[true,"U must enter your Email"]
   } ,
   password :{
    type:String,
   required :[true,"enter password please"] 
   } ,
   confirmPassword :{
    type:String,
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
    required :[true,"enter  confirm password please"] 
   } ,
   isAdmin :{
    type:Boolean,
    default: false ,
  
   },

   otp:{
    type:String
   },
   otpExpires:{
    type:Date
   }

   
})


userSchema.pre('save', async function (next) { //middle ware 
   //only run if password modified
   if (!this.isModified('password')) {
     return next();
   }
   //bcrypt ==> hash password
   this.password = await bcrypt.hash(this.password, 12);
   this.confirmPassword = undefined;
 
   next();
 });


 userSchema.methods.correctPassword = async function (
   candidatePassword,
   userPassword
 ) {
   return await bcrypt.compare(candidatePassword, userPassword); 
    //bycryt ==>used to hash password 
    //compare==>used to compare password that user enterd and the userPassword that saved in DB 
 };

 
 userSchema.methods.generateOtp = async function () {
  //OTP used to generate OTP ==>in reset password  (resetCode) 
  const OTP = generateOTP.generate(process.env.OTP_LENGTH, {
    upperCaseAlphabets: true,
    specialChars: false,
  });
  this.otp = crypto.createHash('sha256').update(OTP).digest('hex');
  //used crypto ==> to encryt the resetCode (OTP) in DB 
  
  console.log("here")
  this.otpExpires = Date.now() + 10 * 60 * 1000; // valid 10 min
  return OTP;
};
 
const User  = mongoose.model('User',userSchema)

module.exports=User;