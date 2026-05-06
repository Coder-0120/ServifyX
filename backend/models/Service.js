const mongoose=require("mongoose");
const serviceSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    category:{
        type:String
    },
    basePrice:{
        type:Number
    },
    description:{
        type:String
    }
},{
    timestamps:true
});

module.exports=mongoose.model("Service",serviceSchema);