
const mongoose=require("mongoose")

module.exports=mongoose.model("Contact",{
 name:String,
 phone:String
})
