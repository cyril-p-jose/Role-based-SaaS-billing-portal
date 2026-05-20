const { query } = require("../config/db");

const findByOrganization = async (organizationId, limit = 50) => {
  const result = await query(
    `SELECT * FROM invoices WHERE organization_id = $1 ORDER BY created_at DESC LIMIT $2`,
    [organizationId, limit]
  );
  return result.rows;
};

const findAllForAdmin = async (limit = 100) => {
  const result = await query(
    `SELECT i.*, o.name as organization_name
     FROM invoices i
     JOIN organizations o ON i.organization_id = o.id
     ORDER BY i.created_at DESC LIMIT $1`,
    [limit]
  );
  return result.rows;
};

const create = async (data) => {
  const result = await query(
    `INSERT INTO invoices (organization_id, stripe_invoice_id, invoice_number, amount, status, description, pdf_url, hosted_invoice_url, due_date, paid_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [
      data.organizationId,
      data.stripeInvoiceId,
      data.invoiceNumber,
      data.amount,
      data.status,
      data.description,
      data.pdfUrl,
      data.hostedInvoiceUrl,
      data.dueDate,
      data.paidAt,
    ]
  );
  return result.rows[0];
};

const getStats = async (organizationId = null) => {
  const where = organizationId ? "WHERE organization_id = $1" : "";
  const params = organizationId ? [organizationId] : [];
  const result = await query(
    `SELECT
       COUNT(*) FILTER (WHERE status = 'paid') as paid_count,
       COUNT(*) FILTER (WHERE status = 'open') as open_count,
       COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0) as total_revenue,
       COALESCE(SUM(amount) FILTER (WHERE status = 'open'), 0) as pending_revenue
     FROM invoices ${where}`,
    params
  );
  return result.rows[0];
};

module.exports = { findByOrganization, findAllForAdmin, create, getStats };
