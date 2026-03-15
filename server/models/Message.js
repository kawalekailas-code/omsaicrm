
const mongoose=require("mongoose")

const schema=new mongoose.Schema({
 phone:String,
 text:String,
 direction:String,
 type:String,
 createdAt:{type:Date,default:Date.now,expires:2592000}
})

module.exports=mongoose.model("Message",schema)
