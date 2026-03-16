require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bodyParser = require("body-parser")

// Socket.IO setup
const http = require("http")
const { Server } = require("socket.io")

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(express.static("public"))
app.use("/uploads", express.static("uploads"))

// MongoDB
mongoose.connect(process.env.MONGO_URL).then(() => {
 console.log("MongoDB connected")
})

// Routes
app.use("/contacts", require("./routes/contacts"))
app.use("/messages", require("./routes/messages"))
app.use("/media", require("./routes/media"))
app.use("/templates", require("./routes/templates"))
app.use("/campaign", require("./routes/campaign"))
app.use("/webhook", require("./routes/webhook"))

// HTTP + Socket.IO server
const serverHttp = http.createServer(app)

const io = new Server(serverHttp, {
 cors: {
  origin: "*"
 }
})

app.set("io", io)

io.on("connection", (socket) => {
 console.log("Socket connected")
})

// Start server
serverHttp.listen(process.env.PORT || 3000, () => {
 console.log("CRM running")
})
