const router=require("express").Router()
const axios=require("axios")

router.post("/send",async(req,res)=>{

 const {phones,template,params}=req.body

 for(let phone of phones){

  await axios.post(
   `https://graph.facebook.com/v19.0/${process.env.PHONE_ID}/messages`,
   {
    messaging_product:"whatsapp",
    to:phone,
    type:"template",
    template:{
     name:template,
     language:{code:"en_US"},
     components:[{
       type:"body",
       parameters:params.map(p=>({type:"text",text:p}))
     }]
    }
   },
   {headers:{Authorization:`Bearer ${process.env.TOKEN}`}}
  )

 }

 res.send({status:"campaign sent"})

})

module.exports=router