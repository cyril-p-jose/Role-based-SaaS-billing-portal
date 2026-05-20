const teamModel = require("../models/teamModel");
const userModel = require("../models/userModel");

const getTeam = async (req, res) => {
  if (!req.user.organization_id) {
    return res.json({ members: [] });
  }
  const members = await teamModel.findByOrganization(req.user.organization_id);
  res.json({ members });
};

const inviteMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    if (!email || !role) {
      return res.status(400).json({ error: "Email and role are required" });
    }
    if (!req.user.organization_id) {
      return res.status(400).json({ error: "Organization required" });
    }

    const allowedRoles = ["admin", "billing_manager", "customer"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const existing = await userModel.findByEmail(email);
    if (existing?.organization_id === req.user.organization_id) {
      return res.status(409).json({ error: "User already in organization" });
    }

    const member = await teamModel.invite({
      organizationId: req.user.organization_id,
      email,
      role,
      invitedBy: req.user.id,
    });

    res.status(201).json({ member });
  } catch (err) {
    console.error("Invite error:", err);
    res.status(500).json({ error: "Failed to invite member" });
  }
};

const updateMemberRole = async (req, res) => {
  try {
    const { role } = req.body;
    const member = await teamModel.updateRole(
      req.params.id,
      req.user.organization_id,
      role
    );
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }
    res.json({ member });
  } catch (err) {
    res.status(500).json({ error: "Failed to update role" });
  }
};

const removeMember = async (req, res) => {
  try {
    await teamModel.remove(req.params.id, req.user.organization_id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove member" });
  }
};

module.exports = { getTeam, inviteMember, updateMemberRole, removeMember };
