const router=require("express").Router()
const axios=require("axios")

router.post("/image",async(req,res)=>{

 const {phone,imageUrl}=req.body

 await axios.post(
 `https://graph.facebook.com/v19.0/${process.env.PHONE_ID}/messages`,
 {
  messaging_product:"whatsapp",
  to:phone,
  type:"image",
  image:{link:imageUrl}
 },
 {headers:{Authorization:`Bearer ${process.env.TOKEN}`}}
 )

 res.send({status:"image_sent"})
})

module.exports=router