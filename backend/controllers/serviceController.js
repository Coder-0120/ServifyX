const Service = require("../models/Service");

// CREATE SERVICE
const createServices = async (req, res) => {
  try {
    const { name, category,basePrice, description } = req.body;
    const service = await Service.create({
      name,
      category,
      basePrice,
      description,
    });

    res.status(201).json({
      message: "Service created successfully",
      service,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL SERVICES
const getallServices = async (req, res) => {
  try {

    const services = await Service.find();
    return res.status(201).json({
        message:"All services fetched successfully",
        services
    })

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  createServices,
  getallServices,
};