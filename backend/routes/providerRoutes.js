const express=require("express");
const router=express.Router();
const {createProviderProfile,getAllProviders,getMyProviderProfile}=require("../controllers/providerController");
const protect=require("../middleware/authMiddleware");



router.post("/create-profile",protect,createProviderProfile);
router.get("/all",getAllProviders);
router.get("/my-profile",protect,getMyProviderProfile);

module.exports=router;