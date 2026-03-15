const mongoose=require("mongoose")

const MessageSchema=new mongoose.Schema({
 phone:String,
 text:String,
 direction:String,
 status:String,
 createdAt:{
  type:Date,
  default:Date.now,
  expires:2592000
 }
})

module.exports=mongoose.model("Message",MessageSchema)