const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    UserName:String,
    Email:String,
    Password:String,
    ConfirmPassword:String
},{strict:false})

const User=mongoose.model("user",userSchema);
module.exports=User