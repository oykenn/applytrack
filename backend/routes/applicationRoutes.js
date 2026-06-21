const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/authMiddleware");

const {
  addApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  updateApplicationStatus,
} = require("../controllers/applicationController");

router.post("/", requireAuth, addApplication);
router.get("/", requireAuth, getApplications);
router.get("/:id", requireAuth, getApplicationById);
router.put("/:id", requireAuth, updateApplication);
router.delete("/:id", requireAuth, deleteApplication);
router.patch("/:id/status", requireAuth, updateApplicationStatus);

module.exports = router;