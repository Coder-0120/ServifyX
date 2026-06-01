const express = require("express");
const { handleAssistant } = require("../controllers/assistantController");
const router = express.Router();

router.post("/", handleAssistant);

module.exports = router;
