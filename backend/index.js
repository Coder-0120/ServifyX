const express=require('express');
const app=express();
const connectDb=require("../backend/config/db");
const dotenv=require("dotenv");
const authRoutes=require("./routes/authRoutes");
const providerRoutes=require("./routes/providerRoutes");
dotenv.config();
connectDb();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/provider", providerRoutes);
app.listen(5000,()=>{
    console.log("server is running on port 5000");
})