const router=require("express").Router()
const Contact=require("../models/Contact")

router.get("/",async(req,res)=>{
 res.send(await Contact.find())
})

router.post("/",async(req,res)=>{
 await Contact.create(req.body)
 res.send({status:"saved"})
})

module.exports=router