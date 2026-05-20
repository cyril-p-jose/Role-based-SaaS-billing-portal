const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const organizationModel = require("../models/organizationModel");
const teamModel = require("../models/teamModel");
const { query } = require("../config/db");

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const register = async (req, res) => {
  try {
    const { email, password, fullName, organizationName, role = "customer" } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: "Email, password, and full name are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const existing = await userModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const allowedRoles = ["customer", "billing_manager"];
    const userRole = allowedRoles.includes(role) ? role : "customer";

    let organizationId = null;
    if (organizationName) {
      const org = await organizationModel.create(organizationName);
      organizationId = org.id;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await userModel.create({
      email,
      passwordHash,
      fullName,
      role: userRole,
      organizationId,
    });

    if (organizationId) {
      await query(
        `INSERT INTO team_members (organization_id, user_id, email, role, status, accepted_at)
         VALUES ($1, $2, $3, $4, 'active', NOW())`,
        [organizationId, user.id, email.toLowerCase(), userRole]
      );
    }

    await teamModel.acceptInvite(user.id, email);

    const token = signToken(user.id);
    const fullUser = await userModel.findById(user.id);

    res.status(201).json({ token, user: fullUser });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signToken(user.id);
    const { password_hash, ...safeUser } = user;

    res.json({
      token,
      user: {
        id: safeUser.id,
        email: safeUser.email,
        full_name: safeUser.full_name,
        role: safeUser.role,
        organization_id: safeUser.organization_id,
        organization_name: safeUser.organization_name,
        avatar_url: safeUser.avatar_url,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

const getMe = async (req, res) => {
  res.json({ user: req.user });
};

const updateProfile = async (req, res) => {
  try {
    const { fullName, avatarUrl } = req.body;
    const user = await userModel.updateProfile(req.user.id, { fullName, avatarUrl });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Profile update failed" });
  }
};

module.exports = { register, login, getMe, updateProfile };
