
require("dotenv").config()
const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const bodyParser=require("body-parser")

const app=express()

app.use(cors())
app.use(bodyParser.json())
app.use(express.static("public"))
app.use("/uploads",express.static("uploads"))

mongoose.connect(process.env.MONGO_URL).then(()=>{
 console.log("MongoDB connected")
})

app.use("/contacts",require("./routes/contacts"))
app.use("/messages",require("./routes/messages"))
app.use("/media",require("./routes/media"))
app.use("/templates",require("./routes/templates"))
app.use("/webhook",require("./routes/webhook"))

app.listen(process.env.PORT||3000,()=>{
 console.log("CRM running")
})
