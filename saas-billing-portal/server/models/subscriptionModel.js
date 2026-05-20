const { query } = require("../config/db");

const findByOrganization = async (organizationId) => {
  const result = await query(
    `SELECT s.*, p.name as plan_name, p.slug as plan_slug, p.price_monthly, p.features
     FROM subscriptions s
     LEFT JOIN plans p ON s.plan_id = p.id
     WHERE s.organization_id = $1
     ORDER BY s.created_at DESC
     LIMIT 1`,
    [organizationId]
  );
  return result.rows[0];
};

const upsert = async ({ organizationId, planId, stripeSubscriptionId, status, periodStart, periodEnd }) => {
  const result = await query(
    `INSERT INTO subscriptions (organization_id, plan_id, stripe_subscription_id, status, current_period_start, current_period_end)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (stripe_subscription_id) DO UPDATE SET
       plan_id = EXCLUDED.plan_id,
       status = EXCLUDED.status,
       current_period_start = EXCLUDED.current_period_start,
       current_period_end = EXCLUDED.current_period_end,
       updated_at = NOW()
     RETURNING *`,
    [organizationId, planId, stripeSubscriptionId, status, periodStart, periodEnd]
  );
  return result.rows[0];
};

const getAllForAdmin = async () => {
  const result = await query(
    `SELECT s.*, p.name as plan_name, o.name as organization_name
     FROM subscriptions s
     JOIN organizations o ON s.organization_id = o.id
     LEFT JOIN plans p ON s.plan_id = p.id
     ORDER BY s.created_at DESC`
  );
  return result.rows;
};

module.exports = { findByOrganization, upsert, getAllForAdmin };
