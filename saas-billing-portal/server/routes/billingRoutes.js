const express = require("express");
const {
  getPlans,
  getSubscription,
  createCheckoutSession,
  createPortalSession,
  getInvoices,
} = require("../controllers/billingController");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/plans", getPlans);
router.get("/subscription", authenticate, getSubscription);
router.get("/invoices", authenticate, getInvoices);
router.post(
  "/checkout",
  authenticate,
  authorize("admin", "billing_manager", "customer"),
  createCheckoutSession
);
router.post(
  "/portal",
  authenticate,
  authorize("admin", "billing_manager"),
  createPortalSession
);

module.exports = router;
