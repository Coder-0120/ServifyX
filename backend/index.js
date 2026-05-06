const express=require('express');
const app=express();
app.use(express.json());
app.get("/",(req,res)=>{
    return res.status(200).json({
        message:"hello"
    })
})
app.listen(5000,()=>{
    console.log("server is running on port 5000");
})