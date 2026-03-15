const router=require("express").Router()
const axios=require("axios")
const Message=require("../models/Message")

router.post("/send",async(req,res)=>{

 const {phone,text}=req.body

 await axios.post(
  `https://graph.facebook.com/v19.0/${process.env.PHONE_ID}/messages`,
  {
   messaging_product:"whatsapp",
   to:phone,
   type:"text",
   text:{body:text}
  },
  {headers:{Authorization:`Bearer ${process.env.TOKEN}`}}
 )

 await Message.create({phone,text,direction:"out",type:"text"})

 res.send({status:"sent"})
})

router.get("/:phone",async(req,res)=>{
 res.send(await Message.find({phone:req.params.phone}))
})

module.exports=router