require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const bcrypt = require("bcryptjs");
const { pool, query } = require("../config/db");

async function seed() {
  try {
    const orgResult = await query(
      `INSERT INTO organizations (name, slug) VALUES ('Acme Corp', 'acme-corp-demo')
       ON CONFLICT (slug) DO NOTHING RETURNING id`
    ).catch(() => ({ rows: [] }));

    let orgId = orgResult.rows[0]?.id;
    if (!orgId) {
      const existing = await query("SELECT id FROM organizations WHERE slug = 'acme-corp-demo'");
      orgId = existing.rows[0]?.id;
    }

    if (!orgId) {
      const created = await query(
        "INSERT INTO organizations (name, slug) VALUES ('Acme Corp', 'acme-corp-demo') RETURNING id"
      );
      orgId = created.rows[0].id;
    }

    const users = [
      { email: "admin@demo.com", name: "Admin User", role: "admin", password: "Admin123!" },
      { email: "billing@demo.com", name: "Billing Manager", role: "billing_manager", password: "Billing123!" },
      { email: "customer@demo.com", name: "Customer User", role: "customer", password: "Customer123!" },
    ];

    for (const u of users) {
      const exists = await query("SELECT id FROM users WHERE email = $1", [u.email]);
      if (exists.rows.length > 0) continue;

      const hash = await bcrypt.hash(u.password, 12);
      const user = await query(
        `INSERT INTO users (email, password_hash, full_name, role, organization_id)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [u.email, hash, u.name, u.role, orgId]
      );

      await query(
        `INSERT INTO team_members (organization_id, user_id, email, role, status, accepted_at)
         VALUES ($1, $2, $3, $4, 'active', NOW())
         ON CONFLICT DO NOTHING`,
        [orgId, user.rows[0].id, u.email, u.role]
      );
    }

    const subExists = await query(
      "SELECT id FROM subscriptions WHERE organization_id = $1",
      [orgId]
    );
    if (subExists.rows.length === 0) {
      const plan = await query("SELECT id FROM plans WHERE slug = 'professional'");
      if (plan.rows[0]) {
        await query(
          `INSERT INTO subscriptions (organization_id, plan_id, status, current_period_start, current_period_end)
           VALUES ($1, $2, 'active', NOW(), NOW() + INTERVAL '30 days')`,
          [orgId, plan.rows[0].id]
        );
      }
    }

    const invCount = await query(
      "SELECT COUNT(*) FROM invoices WHERE organization_id = $1",
      [orgId]
    );
    if (parseInt(invCount.rows[0].count) === 0) {
      const invoices = [
        { num: "INV-2024-001", amount: 79, status: "paid" },
        { num: "INV-2024-002", amount: 79, status: "paid" },
        { num: "INV-2024-003", amount: 79, status: "open" },
      ];
      for (const inv of invoices) {
        await query(
          `INSERT INTO invoices (organization_id, invoice_number, amount, status, paid_at)
           VALUES ($1, $2, $3, $4, $5)`,
          [orgId, inv.num, inv.amount, inv.status, inv.status === "paid" ? new Date() : null]
        );
      }
    }

    console.log("Seed completed successfully!");
    console.log("Demo accounts:");
    users.forEach((u) => console.log(`  ${u.role}: ${u.email} / ${u.password}`));
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
