const express = require("express");
const { getDashboardStats, getAdminOverview } = require("../controllers/analyticsController");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(authenticate);

router.get("/dashboard", getDashboardStats);
router.get("/admin", authorize("admin"), getAdminOverview);

module.exports = router;
