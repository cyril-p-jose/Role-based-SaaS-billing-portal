const { query } = require("../config/db");

const findAll = async () => {
  const result = await query(
    `SELECT * FROM plans WHERE is_active = true ORDER BY sort_order ASC`
  );
  return result.rows;
};

const findBySlug = async (slug) => {
  const result = await query("SELECT * FROM plans WHERE slug = $1 AND is_active = true", [slug]);
  return result.rows[0];
};

const findById = async (id) => {
  const result = await query("SELECT * FROM plans WHERE id = $1", [id]);
  return result.rows[0];
};

module.exports = { findAll, findBySlug, findById };
