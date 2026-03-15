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
 const {name,phone}=req.body
 await Contact.create({name,phone})
 res.send({status:"saved"})
})

router.delete("/:id",async(req,res)=>{
 await Contact.findByIdAndDelete(req.params.id)
 res.send({status:"deleted"})
})

router.post("/upload",upload.single("file"),async(req,res)=>{

 let rows=[]

 fs.createReadStream(req.file.path)
 .pipe(csv())
 .on("data",(d)=>rows.push(d))
 .on("end",async()=>{

  for(let r of rows){
   await Contact.create({name:r.name,phone:r.phone})
  }

  fs.unlinkSync(req.file.path)

  res.send({imported:rows.length})
 })

})

module.exports=router