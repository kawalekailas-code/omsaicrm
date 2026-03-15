const router=require("express").Router()
const User=require("../models/User")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

router.post("/login",async(req,res)=>{

 const {email,password}=req.body
 const user=await User.findOne({email})

 if(!user) return res.status(401).send("user not found")

 const ok=await bcrypt.compare(password,user.password)
 if(!ok) return res.status(401).send("wrong password")

 const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
 res.send({token})

})

module.exports=router