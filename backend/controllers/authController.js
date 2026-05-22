const generateToken=require("../utils/generateToken");
const UserModel=require("../models/User");
const bcrypt=require("bcryptjs");

// to register new user
const registerUser=async(req,res)=>{
    try{

        const{name,email,password,role}=req.body;
        const existUser=await UserModel.findOne({email});
        if(existUser){
            return  res.status(400).json({message:"user already exist"});
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const user=await UserModel.create({
            name,
            email,
            password:hashedPassword,
            role
        });
        return res.status(201).json({
            message:"User is created successfully..",
            token:generateToken(user._id),
            user,
        })
    }
    catch(error){
        return res.status(500).json({
            message:"Internal server error..",
            error:error.message
        })
    }
}
// to login the user
const loginUser = async (req, res) => {
  try {

    const { email, password, role } = req.body;

    // CHECK USER
    const existUser = await UserModel.findOne({ email });

    if (!existUser) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // CHECK ROLE
    if (existUser.role !== role) {
      return res.status(400).json({
        message: "Invalid role selected",
      });
    }

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(
      password,
      existUser.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // SEND RESPONSE
    return res.status(200).json({
      message: "User login successfully",

      token: generateToken(existUser._id),

      user: {
        _id: existUser._id,
        name: existUser.name,
        email: existUser.email,
        role: existUser.role,
      },
    });

  } catch (error) {

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });

  }
};
module.exports={registerUser,loginUser};