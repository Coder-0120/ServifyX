const mongoose=require("mongoose");
const bookingSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    providerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    serviceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Service",
        required:true,
    },
    address:String,
    note:String,
    status:{
        type:String,
        enum: [
        "requested",
        "accepted",
        "in_progress",
        "completed",
        "cancelled",
      ],
      default:"requested",
    },
    paymentStatus:{
        type:String,
        enum:["pending","paid","failed"],
        default:"pending",
    },
    scheduledTime:Date,
},{
    timestamps:true
})

module.exports=mongoose.model("Booking",bookingSchema);