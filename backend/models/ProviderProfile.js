const mongoose=require("mongoose");
const providerSchema =new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    serviceType:{
        type:String,
        required:true
    },
    experience:{
        type:Number,
        default:0
    },
    isAvailable:{
        type:Boolean,
        default:true,
    },
    location:{
        lat:Number,
        lng:Number,
    },
    rating:{
        type:Number,
        default:0
    }
},{
    timestamps:true
});

module.exports=mongoose.model("ProviderProfile",providerSchema);