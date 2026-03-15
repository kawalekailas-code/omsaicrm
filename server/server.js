require("dotenv").config()
const express=require("express")
const mongoose=require("mongoose")
const bodyParser=require("body-parser")
const cors=require("cors")
const bcrypt=require("bcrypt")

const User=require("./models/User")

const auth=require("./routes/auth")
const contacts=require("./routes/contacts")
const messages=require("./routes/messages")
const templates=require("./routes/templates")
const webhook=require("./routes/webhook")
const media=require("./routes/media")

const app=express()

app.use(cors())
app.use(bodyParser.json())
app.use(express.static("public"))

app.use("/auth",auth)
app.use("/contacts",contacts)
app.use("/messages",messages)
app.use("/templates",templates)
app.use("/media",media)
app.use("/webhook",webhook)

async function createAdmin(){
 const email="admin@crm.com"
 const password="123456"

 const existing=await User.findOne({email})

 if(!existing){
   const hash=await bcrypt.hash(password,10)
   await User.create({email,password:hash})
   console.log("Default admin created")
 }else{
   console.log("Admin already exists")
 }
}

mongoose.connect(process.env.MONGO_URL).then(async ()=>{
 console.log("MongoDB connected")
 await createAdmin()

 app.listen(process.env.PORT||3000,()=>{
  console.log("WhatsApp CRM running")
 })
})