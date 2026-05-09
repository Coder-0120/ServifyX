const express=require("express");
const router=express.Router();
const {createProviderProfile,getAllProviders}=require("../controllers/providerController");
const protect=require("../middleware/authMiddleware");


router.post("/create-profile",protect,createProviderProfile);
router.get("/all",getAllProviders);

module.exports=router;