// backend/controllers/bookingController.js
const Booking = require("../models/Booking");
const Service = require("../models/Service");
const ProviderProfile = require("../models/ProviderProfile");
const { getIO } = require("../socket"); // ← NEW

// ─────────────────────────────────────────────
// CREATE BOOKING
// ─────────────────────────────────────────────
const createBooking = async (req, res) => {
  try {
    const { serviceId, scheduledTime, address, note } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      serviceId,
      scheduledTime,
      status: "requested",
      paymentStatus: "pending",
      address: address.trim() || undefined,
      note: note.trim() || undefined,
    });

    // Populate for rich socket payload
    const populatedBooking = await Booking.findById(booking._id)
      .populate("userId", "name email")
      .populate("serviceId");

    // Find matching providers
    const matchingProviders = await ProviderProfile.find({
      serviceType: service.name.toLowerCase(),
    }).populate("userId", "name email");

    // ── SOCKET: Notify all providers in this service room ──────────────
    try {
      const io = getIO();
      io.to(`service_${service.name.toLowerCase()}`).emit("new_booking", {
        booking: populatedBooking,
        message: `New booking for ${service.name}!`,
      });
    } catch (socketErr) {
      console.error("Socket emit error:", socketErr.message);
    }
    // ────────────────────────────────────────────────────────────────────

    res.status(201).json({
      message: "Booking created successfully",
      booking: populatedBooking,
      matchingProviders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// ACCEPT BOOKING
// ─────────────────────────────────────────────
const acceptBooking = async (req, res) => {
  try {
    if (req.user.role !== "provider") {
      return res.status(403).json({ message: "Only providers can accept bookings" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.providerId) return res.status(400).json({ message: "Booking already accepted" });

    booking.providerId = req.user._id;
    booking.status = "accepted";
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("userId", "name email")
      .populate("providerId", "name email")
      .populate("serviceId");

    // ── SOCKET: Notify the user who created this booking ────────────────
    try {
      const io = getIO();
      // Notify the specific user
      io.to(booking.userId.toString()).emit("booking_status_changed", {
        booking: populatedBooking,
        message: `Your booking has been accepted by ${req.user.name}!`,
      });
      // Also broadcast to service room so other providers stop seeing it as open
      io.to(`service_${populatedBooking.serviceId?.name?.toLowerCase()}`).emit(
        "booking_accepted_by_other",
        { bookingId: booking._id.toString() }
      );
    } catch (socketErr) {
      console.error("Socket emit error:", socketErr.message);
    }
    // ────────────────────────────────────────────────────────────────────

    res.status(200).json({ message: "Booking accepted successfully", booking: populatedBooking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// CANCEL BOOKING
// ─────────────────────────────────────────────
const cancelBooking = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Only users can cancel bookings" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("userId", "name email")
      .populate("providerId", "name email")
      .populate("serviceId");

    // ── SOCKET: Notify provider if one was assigned ──────────────────────
    try {
      const io = getIO();
      if (booking.providerId) {
        io.to(booking.providerId.toString()).emit("booking_status_changed", {
          booking: populatedBooking,
          message: "A booking you accepted was cancelled by the user.",
        });
      }
      // Notify the user too (confirms cancellation)
      io.to(booking.userId.toString()).emit("booking_status_changed", {
        booking: populatedBooking,
        message: "Your booking has been cancelled.",
      });
    } catch (socketErr) {
      console.error("Socket emit error:", socketErr.message);
    }
    // ────────────────────────────────────────────────────────────────────

    res.status(200).json({ message: "Booking cancelled successfully", booking: populatedBooking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// UPDATE BOOKING STATUS (provider: in_progress / completed)
// ─────────────────────────────────────────────
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.providerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = status;
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("userId", "name email")
      .populate("providerId", "name email")
      .populate("serviceId");

    // ── SOCKET: Notify the user about status change ──────────────────────
    try {
      const io = getIO();
      const statusMessages = {
        in_progress: "Your service is now in progress!",
        completed:   "Your service has been completed!",
      };
      io.to(booking.userId.toString()).emit("booking_status_changed", {
        booking: populatedBooking,
        message: statusMessages[status] || `Booking status updated to ${status}`,
      });
      // Also notify the provider's own room (so their dashboard updates)
      io.to(req.user._id.toString()).emit("booking_status_changed", {
        booking: populatedBooking,
        message: `Status updated to ${status}`,
      });
    } catch (socketErr) {
      console.error("Socket emit error:", socketErr.message);
    }
    // ────────────────────────────────────────────────────────────────────

    res.status(200).json({ message: "Booking status updated", booking: populatedBooking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// GET MY BOOKINGS (unchanged)
// ─────────────────────────────────────────────
const getMyBookings = async (req, res) => {
  try {
    let bookings;

    if (req.user.role === "provider") {
      const providerProfile = await ProviderProfile.findOne({ userId: req.user._id });
      if (!providerProfile || !providerProfile.serviceType) {
        return res.status(200).json([]);
      }

      const service = await Service.findOne({
        name: { $regex: `^${providerProfile.serviceType}$`, $options: "i" },
      });
      if (!service) return res.status(200).json([]);

      bookings = await Booking.find({
        $or: [
          { status: "requested", serviceId: service._id },
          { providerId: req.user._id },
        ],
      })
        .populate("providerId", "name email")
        .populate("userId", "name email")
        .populate("serviceId")
        .sort({ createdAt: -1 });
    } else {
      bookings = await Booking.find({ userId: req.user._id })
        .populate("providerId", "name email")
        .populate("serviceId")
        .sort({ createdAt: -1 });
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  acceptBooking,
  updateBookingStatus,
  getMyBookings,
  cancelBooking,
};