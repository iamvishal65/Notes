const express=require("express");
const app=express();
const cookieParser = require("cookie-parser");
const authRoutes=require("./routes/auth.routes")
const contentRoutes=require('./routes/content.routes')
const cors = require("cors");


app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173", // your frontend origin
  credentials: true
}));
app.use('/api/auth',authRoutes)
app.use('/api/content',contentRoutes)

app.get("/", (req, res) => {
    res.send("Server is working 🚀");
  });

module.exports=app;