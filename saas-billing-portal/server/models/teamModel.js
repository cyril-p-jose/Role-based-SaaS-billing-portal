const { query } = require("../config/db");

const findByOrganization = async (organizationId) => {
  const result = await query(
    `SELECT tm.*, u.full_name, u.email as user_email, u.avatar_url
     FROM team_members tm
     LEFT JOIN users u ON tm.user_id = u.id
     WHERE tm.organization_id = $1 AND tm.status != 'removed'
     ORDER BY tm.invited_at DESC`,
    [organizationId]
  );
  return result.rows;
};

const invite = async ({ organizationId, email, role, invitedBy }) => {
  const result = await query(
    `INSERT INTO team_members (organization_id, email, role, invited_by, status)
     VALUES ($1, $2, $3, $4, 'pending')
     ON CONFLICT (organization_id, email) DO UPDATE SET role = EXCLUDED.role, status = 'pending'
     RETURNING *`,
    [organizationId, email.toLowerCase(), role, invitedBy]
  );
  return result.rows[0];
};

const updateRole = async (id, organizationId, role) => {
  const result = await query(
    `UPDATE team_members SET role = $3 WHERE id = $1 AND organization_id = $2 RETURNING *`,
    [id, organizationId, role]
  );
  return result.rows[0];
};

const remove = async (id, organizationId) => {
  await query(
    `UPDATE team_members SET status = 'removed' WHERE id = $1 AND organization_id = $2`,
    [id, organizationId]
  );
};

const acceptInvite = async (userId, email) => {
  await query(
    `UPDATE team_members SET user_id = $1, status = 'active', accepted_at = NOW()
     WHERE email = $2 AND status = 'pending'`,
    [userId, email.toLowerCase()]
  );
};

module.exports = { findByOrganization, invite, updateRole, remove, acceptInvite };
