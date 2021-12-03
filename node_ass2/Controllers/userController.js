const User=require("../Models/user");

var nodemailer = require('nodemailer');
require('dotenv').config()
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});


exports.signup=async (req,res,next)=>{
   
    var user=await User.find({Email:req.body.Email})
    if(user.length>0) return  res.json({message:"user already exist"});
    
    var register=new User({
        UserName:req.body.UserName,
        Email:req.body.Email,
        Password:req.body.Password,
        ConfirmPassword:req.body.ConfirmPassword
    })
    const data=await register.save().then(result=>{
        var mailOptions = {
            from: process.env.EMAIL,
            to: req.body.Email,
            subject: 'SignUp successfully',
            text: 'Welcome ' +req.body.UserName
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        res.status(200).json({message:"user registered successfully",userList:result})
    }).catch((err)=>{
        console.log(err);
    })
}
