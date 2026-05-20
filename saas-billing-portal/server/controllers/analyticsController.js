const { query } = require("../config/db");
const invoiceModel = require("../models/invoiceModel");
const subscriptionModel = require("../models/subscriptionModel");

const getDashboardStats = async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    const orgId = isAdmin ? null : req.user.organization_id;

    const invoiceStats = await invoiceModel.getStats(orgId);

    const userCount = await query(
      isAdmin
        ? "SELECT COUNT(*) as count FROM users WHERE is_active = true"
        : "SELECT COUNT(*) as count FROM users WHERE organization_id = $1 AND is_active = true",
      isAdmin ? [] : [orgId]
    );

    const orgCount = isAdmin
      ? (await query("SELECT COUNT(*) as count FROM organizations")).rows[0]
      : { count: 1 };

    const subCount = isAdmin
      ? (await query("SELECT COUNT(*) as count FROM subscriptions WHERE status = 'active'")).rows[0]
      : orgId
        ? (await query(
            "SELECT COUNT(*) as count FROM subscriptions WHERE organization_id = $1 AND status = 'active'",
            [orgId]
          )).rows[0]
        : { count: 0 };

    const revenueByMonth = await query(
      isAdmin
        ? `SELECT TO_CHAR(created_at, 'Mon') as month,
                  EXTRACT(MONTH FROM created_at) as month_num,
                  COALESCE(SUM(amount), 0) as revenue
           FROM invoices WHERE status = 'paid' AND created_at > NOW() - INTERVAL '6 months'
           GROUP BY TO_CHAR(created_at, 'Mon'), EXTRACT(MONTH FROM created_at)
           ORDER BY month_num`
        : `SELECT TO_CHAR(created_at, 'Mon') as month,
                  EXTRACT(MONTH FROM created_at) as month_num,
                  COALESCE(SUM(amount), 0) as revenue
           FROM invoices WHERE organization_id = $1 AND status = 'paid' AND created_at > NOW() - INTERVAL '6 months'
           GROUP BY TO_CHAR(created_at, 'Mon'), EXTRACT(MONTH FROM created_at)
           ORDER BY month_num`,
      isAdmin ? [] : [orgId]
    );

    const planDistribution = await query(
      `SELECT p.name, COUNT(s.id) as count
       FROM plans p
       LEFT JOIN subscriptions s ON s.plan_id = p.id AND s.status = 'active'
       GROUP BY p.name, p.sort_order
       ORDER BY p.sort_order`
    );

    res.json({
      stats: {
        totalRevenue: parseFloat(invoiceStats.total_revenue) || 0,
        pendingRevenue: parseFloat(invoiceStats.pending_revenue) || 0,
        paidInvoices: parseInt(invoiceStats.paid_count) || 0,
        openInvoices: parseInt(invoiceStats.open_count) || 0,
        activeUsers: parseInt(userCount.rows[0].count) || 0,
        organizations: parseInt(orgCount.count) || 0,
        activeSubscriptions: parseInt(subCount.count) || 0,
      },
      revenueByMonth: revenueByMonth.rows,
      planDistribution: planDistribution.rows,
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};

const getAdminOverview = async (req, res) => {
  try {
    const subscriptions = await subscriptionModel.getAllForAdmin();
    const invoices = await invoiceModel.findAllForAdmin(20);
    const recentUsers = await query(
      `SELECT u.id, u.email, u.full_name, u.role, u.created_at, o.name as organization_name
       FROM users u LEFT JOIN organizations o ON u.organization_id = o.id
       ORDER BY u.created_at DESC LIMIT 10`
    );

    res.json({
      subscriptions,
      recentInvoices: invoices,
      recentUsers: recentUsers.rows,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch admin overview" });
  }
};

module.exports = { getDashboardStats, getAdminOverview };
