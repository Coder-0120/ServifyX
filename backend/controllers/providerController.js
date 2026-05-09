const ProviderProfile = require("../models/ProviderProfile");

// creating providere profile (done by providers only)
const createProviderProfile=async(req,res)=>{
    try{
      // checking it should be provider only 
      if(req.user.role!=="provider"){
        return res.status(401).json({
            message:"only providers can create profile"
        });
      }   
      const{serviceType,experience}=req.body;
      const profile=await ProviderProfile.create({
        userId:req.user._id,
        serviceType,
        experience
      });
      return res.status(201).json({
        message:"provider profile has been created ",
        profile
      })
    }
    catch(error){
        return res.status(500).json({
            message:error.message
        })
    }
}

module.exports=createProviderProfile;