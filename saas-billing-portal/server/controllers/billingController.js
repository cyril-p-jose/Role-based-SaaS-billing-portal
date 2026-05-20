const stripe = require("../config/stripe");
const planModel = require("../models/planModel");
const subscriptionModel = require("../models/subscriptionModel");
const organizationModel = require("../models/organizationModel");
const invoiceModel = require("../models/invoiceModel");
const { query } = require("../config/db");

const getPlans = async (req, res) => {
  const plans = await planModel.findAll();
  res.json({ plans });
};

const getSubscription = async (req, res) => {
  if (!req.user.organization_id) {
    return res.json({ subscription: null });
  }
  const subscription = await subscriptionModel.findByOrganization(req.user.organization_id);
  res.json({ subscription });
};

const createCheckoutSession = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ error: "Stripe is not configured" });
    }

    const { planSlug, billingCycle = "monthly" } = req.body;
    const plan = await planModel.findBySlug(planSlug);
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    let org = await organizationModel.findById(req.user.organization_id);
    if (!org) {
      return res.status(400).json({ error: "Organization required" });
    }

    if (!org.stripe_customer_id) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.full_name,
        metadata: { organization_id: org.id },
      });
      await organizationModel.updateStripeCustomer(org.id, customer.id);
      org.stripe_customer_id = customer.id;
    }

    const amount = billingCycle === "yearly" ? plan.price_yearly : plan.price_monthly;
    const lineItems = plan.stripe_price_id
      ? [{ price: plan.stripe_price_id, quantity: 1 }]
      : [
          {
            price_data: {
              currency: "usd",
              product_data: { name: plan.name, description: plan.description },
              unit_amount: Math.round(amount * 100),
              recurring: {
                interval: billingCycle === "yearly" ? "year" : "month",
              },
            },
            quantity: 1,
          },
        ];

    const session = await stripe.checkout.sessions.create({
      customer: org.stripe_customer_id,
      mode: "subscription",
      line_items: lineItems,
      success_url: `${process.env.CLIENT_URL}/billing?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/billing?canceled=true`,
      metadata: {
        organization_id: org.id,
        plan_id: plan.id,
        user_id: req.user.id,
      },
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};

const createPortalSession = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ error: "Stripe is not configured" });
    }

    const org = await organizationModel.findById(req.user.organization_id);
    if (!org?.stripe_customer_id) {
      return res.status(400).json({ error: "No billing account found" });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: org.stripe_customer_id,
      return_url: `${process.env.CLIENT_URL}/billing`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Portal error:", err);
    res.status(500).json({ error: "Failed to create portal session" });
  }
};

const getInvoices = async (req, res) => {
  if (!req.user.organization_id) {
    return res.json({ invoices: [] });
  }
  const invoices = await invoiceModel.findByOrganization(req.user.organization_id);
  res.json({ invoices });
};

const handleWebhook = async (req, res) => {
  if (!stripe) {
    return res.status(503).send("Stripe not configured");
  }

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const { organization_id, plan_id } = session.metadata || {};
        if (organization_id && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription);
          await subscriptionModel.upsert({
            organizationId: organization_id,
            planId: plan_id,
            stripeSubscriptionId: sub.id,
            status: sub.status,
            periodStart: new Date(sub.current_period_start * 1000),
            periodEnd: new Date(sub.current_period_end * 1000),
          });
        }
        break;
      }
      case "invoice.paid": {
        const inv = event.data.object;
        const orgId = inv.metadata?.organization_id;
        if (orgId) {
          await invoiceModel.create({
            organizationId: orgId,
            stripeInvoiceId: inv.id,
            invoiceNumber: inv.number || `INV-${inv.id.slice(-8)}`,
            amount: inv.amount_paid / 100,
            status: "paid",
            description: inv.description,
            pdfUrl: inv.invoice_pdf,
            hostedInvoiceUrl: inv.hosted_invoice_url,
            paidAt: new Date(),
          });
        }
        break;
      }
      default:
        break;
    }
    res.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    res.status(500).json({ error: "Webhook processing failed" });
  }
};

module.exports = {
  getPlans,
  getSubscription,
  createCheckoutSession,
  createPortalSession,
  getInvoices,
  handleWebhook,
};
