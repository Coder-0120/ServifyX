const express=require('express');
const app=express();
const connectDb=require("../backend/config/db");
const dotenv=require("dotenv");
const authRoutes=require("./routes/authRoutes");
dotenv.config();
connectDb();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.listen(5000,()=>{
    console.log("server is running on port 5000");
})