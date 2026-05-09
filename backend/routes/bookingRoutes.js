const express = require("express");

const router = express.Router();

const {
  createBooking,
  acceptBooking,
  updateBookingStatus,
  getMyBookings,
} = require("../controllers/bookingController");

const protect  = require("../middleware/authMiddleware");


// CREATE BOOKING
router.post("/create", protect, createBooking);

// ACCEPT BOOKING
router.patch("/accept/:id", protect, acceptBooking);

// UPDATE STATUS
router.patch("/status/:id", protect, updateBookingStatus);

// GET USER BOOKINGS
router.get("/my-bookings", protect, getMyBookings);

module.exports = router;