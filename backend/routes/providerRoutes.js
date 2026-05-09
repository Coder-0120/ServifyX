const express=require("express");
const router=express.Router();
const createProviderProfile=require("../controllers/providerController");
const protect=require("../middleware/authMiddleware");


router.post("/create-profile",protect,createProviderProfile);

module.exports=router;