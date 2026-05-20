const express = require("express");
const { getTeam, inviteMember, updateMemberRole, removeMember } = require("../controllers/teamController");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(authenticate);
router.use(authorize("admin", "billing_manager"));

router.get("/", getTeam);
router.post("/invite", inviteMember);
router.patch("/:id", updateMemberRole);
router.delete("/:id", removeMember);

module.exports = router;
