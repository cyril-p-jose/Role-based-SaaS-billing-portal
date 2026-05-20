const { query } = require("../config/db");

const create = async (name) => {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const result = await query(
    `INSERT INTO organizations (name, slug) VALUES ($1, $2)
     RETURNING id, name, slug, created_at`,
    [name, `${slug}-${Date.now().toString(36)}`]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await query("SELECT * FROM organizations WHERE id = $1", [id]);
  return result.rows[0];
};

const updateStripeCustomer = async (id, stripeCustomerId) => {
  await query(
    "UPDATE organizations SET stripe_customer_id = $2, updated_at = NOW() WHERE id = $1",
    [id, stripeCustomerId]
  );
};

module.exports = { create, findById, updateStripeCustomer };
