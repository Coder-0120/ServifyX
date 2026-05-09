const Booking = require("../models/Booking");
const Service = require("../models/Service");
const ProviderProfile = require("../models/ProviderProfile");


// CREATE BOOKING
const createBooking = async (req, res) => {
  try {

    const { serviceId, scheduledTime } = req.body;

    // validate service
    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // create booking
    const booking = await Booking.create({
      userId: req.user._id,
      serviceId,
      scheduledTime,
      status: "requested",
      paymentStatus: "pending",
    });

    // find matching providers
    const matchingProviders = await ProviderProfile.find({
      serviceType: service.name.toLowerCase(),
    }).populate("userId", "name email");

    // LATER:
    // socket emit here

    res.status(201).json({
      message: "Booking created successfully",
      booking,
      matchingProviders,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// accept the booking 
const acceptBooking = async (req, res) => {
  try {

    // provider check
    if (req.user.role !== "provider") {
      return res.status(403).json({
        message: "Only providers can accept bookings",
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // prevent multiple acceptance
    if (booking.providerId) {
      return res.status(400).json({
        message: "Booking already accepted",
      });
    }

    booking.providerId = req.user._id;

    booking.status = "accepted";

    await booking.save();

    res.status(200).json({
      message: "Booking accepted successfully",
      booking,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateBookingStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // only assigned provider
    if (
      booking.providerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    booking.status = status;

    await booking.save();

    res.status(200).json({
      message: "Booking status updated",
      booking,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMyBookings = async (req, res) => {
  try {

    const bookings = await Booking.find({
      userId: req.user._id,
    })
      .populate("providerId", "name email")
      .populate("serviceId");

    res.status(200).json(bookings);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  createBooking,
  acceptBooking,
  updateBookingStatus,
  getMyBookings,
};