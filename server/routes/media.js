
const router=require("express").Router()
const multer=require("multer")
const axios=require("axios")
const Message=require("../models/Message")

const upload=multer({dest:"uploads/"})

router.post("/upload",upload.single("file"),async(req,res)=>{

 const phone=req.body.phone
 const file=req.file

 const fileUrl=`${req.protocol}://${req.get("host")}/uploads/${file.filename}`

 const isImage=file.mimetype.startsWith("image")

 if(isImage){

  await axios.post(
   `https://graph.facebook.com/v19.0/${process.env.PHONE_ID}/messages`,
   {
    messaging_product:"whatsapp",
    to:phone,
    type:"image",
    image:{link:fileUrl}
   },
   {headers:{Authorization:`Bearer ${process.env.TOKEN}`}}
  )

 }else{

  await axios.post(
   `https://graph.facebook.com/v19.0/${process.env.PHONE_ID}/messages`,
   {
    messaging_product:"whatsapp",
    to:phone,
    type:"document",
    document:{link:fileUrl,filename:file.originalname}
   },
   {headers:{Authorization:`Bearer ${process.env.TOKEN}`}}
  )

 }

 await Message.create({
  phone,
  text:file.originalname,
  direction:"out",
  type:isImage?"image":"document"
 })

 res.send({status:"file sent"})
})

module.exports=router
