
const router=require("express").Router()
const Message=require("../models/Message")

router.get("/",(req,res)=>{

 if(req.query["hub.verify_token"]===process.env.VERIFY_TOKEN){
  return res.send(req.query["hub.challenge"])
 }

 res.sendStatus(403)
})

router.post("/",async(req,res)=>{

 const msg=req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]

 if(msg){

  const io=req.app.get("io");
await Message.create({
   phone:msg.from,
   text:msg.text?.body||"media",
   direction:"in",
   type:"text"
  })

 }

 if(io){ io.emit("newMessage",{phone:msg.from,text:msg.text?.body||"media"}); }
res.sendStatus(200)
})

module.exports=router
