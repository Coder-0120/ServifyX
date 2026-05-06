const mongoose=require("mongoose");
const connectDb=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("mongodb is connected");
    }
    catch{
        console.log("Error in connecting mongodb");

    }
}

module.exports=connectDb;