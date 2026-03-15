require("dotenv").config()
const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const bodyParser=require("body-parser")

const app=express()

app.use(cors())
app.use(bodyParser.json())
app.use(express.static("public"))

mongoose.connect(process.env.MONGO_URL).then(()=>{
 console.log("MongoDB connected")
})

app.use("/contacts",require("./routes/contacts"))
app.use("/templates",require("./routes/templates"))
app.use("/campaign",require("./routes/campaign"))

app.listen(process.env.PORT||3000,()=>{
 console.log("CRM running")
})