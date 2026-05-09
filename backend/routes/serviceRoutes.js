const express=require("express");
const router=express.Router();
const {createServices,getallServices}=require("../controllers/serviceController");
const protect=require("../middleware/authMiddleware");


router.post("/create",protect,createServices);
router.get("/all",getallServices);

module.exports=router;