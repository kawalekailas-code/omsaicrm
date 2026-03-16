
const router=require("express").Router()
const axios=require("axios")

router.get("/",async(req,res)=>{

 const r=await axios.get(
  `https://graph.facebook.com/v19.0/${process.env.WABA_ID}/message_templates`,
  {headers:{Authorization:`Bearer ${process.env.TOKEN}`}}
 )

 res.send(r.data)
})

module.exports=router
