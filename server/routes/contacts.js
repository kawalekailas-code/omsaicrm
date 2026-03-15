
const router=require("express").Router()
const Contact=require("../models/Contact")
const multer=require("multer")
const csv=require("csv-parser")
const fs=require("fs")

const upload=multer({dest:"uploads/"})

router.get("/",async(req,res)=>{
 res.send(await Contact.find())
})

router.post("/",async(req,res)=>{
 await Contact.create(req.body)
 res.send({status:"saved"})
})

router.post("/upload",upload.single("file"),async(req,res)=>{

 let rows=[]

 fs.createReadStream(req.file.path)
 .pipe(csv())
 .on("data",(data)=>rows.push(data))
 .on("end",async()=>{

  for(let r of rows){
   await Contact.create({
    name:r.name,
    phone:r.phone
   })
  }

  fs.unlinkSync(req.file.path)

  res.send({imported:rows.length})
 })

})

module.exports=router
