const { query } = require("../config/db");

const findByEmail = async (email) => {
  const result = await query(
    `SELECT u.*, o.name as organization_name
     FROM users u
     LEFT JOIN organizations o ON u.organization_id = o.id
     WHERE u.email = $1`,
    [email.toLowerCase()]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await query(
    `SELECT u.id, u.email, u.full_name, u.role, u.organization_id, u.avatar_url, u.created_at,
            o.name as organization_name
     FROM users u
     LEFT JOIN organizations o ON u.organization_id = o.id
     WHERE u.id = $1`,
    [id]
  );
  return result.rows[0];
};

const create = async ({ email, passwordHash, fullName, role, organizationId }) => {
  const result = await query(
    `INSERT INTO users (email, password_hash, full_name, role, organization_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, full_name, role, organization_id, created_at`,
    [email.toLowerCase(), passwordHash, fullName, role, organizationId]
  );
  return result.rows[0];
};

const updateProfile = async (id, { fullName, avatarUrl }) => {
  const result = await query(
    `UPDATE users SET full_name = COALESCE($2, full_name),
                      avatar_url = COALESCE($3, avatar_url),
                      updated_at = NOW()
     WHERE id = $1
     RETURNING id, email, full_name, role, organization_id, avatar_url`,
    [id, fullName, avatarUrl]
  );
  return result.rows[0];
};

module.exports = { findByEmail, findById, create, updateProfile };
