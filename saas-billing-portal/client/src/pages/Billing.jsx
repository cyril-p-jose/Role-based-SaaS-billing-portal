import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, ExternalLink } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { billingAPI } from "../services/api";

export default function Billing() {
  const { canManageBilling } = useAuth();
  const [searchParams] = useSearchParams();
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(null);

  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  useEffect(() => {
    const load = async () => {
      const [plansRes, subRes] = await Promise.all([
        billingAPI.getPlans(),
        billingAPI.getSubscription(),
      ]);
      setPlans(plansRes.data.plans);
      setSubscription(subRes.data.subscription);
      setLoading(false);
    };
    load();
  }, [success]);

  const handleSubscribe = async (planSlug) => {
    setCheckoutLoading(planSlug);
    try {
      const { data } = await billingAPI.createCheckout({ planSlug, billingCycle });
      if (data.url) window.location.href = data.url;
    } catch (err) {
      alert(err.response?.data?.error || "Checkout failed. Ensure Stripe is configured.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handlePortal = async () => {
    try {
      const { data } = await billingAPI.createPortal();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      alert(err.response?.data?.error || "Billing portal unavailable");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  const features = (plan) => {
    if (Array.isArray(plan.features)) return plan.features;
    try {
      return JSON.parse(plan.features);
    } catch {
      return [];
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      {success && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
          Subscription updated successfully!
        </div>
      )}
      {canceled && (
        <div className="rounded-xl bg-amber-50 px-4 py-3 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
          Checkout was canceled.
        </div>
      )}

      {subscription && (
        <div className="glass-card">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Current Subscription</h3>
              <p className="mt-1 text-2xl font-bold">{subscription.plan_name}</p>
              <span className={`badge mt-2 ${subscription.status === "active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-slate-100 text-slate-600"}`}>
                {subscription.status}
              </span>
            </div>
            {canManageBilling && subscription.stripe_subscription_id && (
              <button onClick={handlePortal} className="btn-secondary">
                Manage billing <ExternalLink className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800 w-fit mx-auto">
        {["monthly", "yearly"].map((cycle) => (
          <button
            key={cycle}
            onClick={() => setBillingCycle(cycle)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-all ${
              billingCycle === cycle
                ? "bg-white shadow dark:bg-slate-700"
                : "text-slate-500"
            }`}
          >
            {cycle}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {plans.map((plan) => {
          const price = billingCycle === "yearly" ? plan.price_yearly : plan.price_monthly;
          const isCurrent = subscription?.plan_slug === plan.slug;
          return (
            <div
              key={plan.id}
              className={`glass-card relative ${plan.is_popular ? "ring-2 ring-brand-500" : ""}`}
            >
              {plan.is_popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                  Popular
                </span>
              )}
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{plan.description}</p>
              <p className="mt-4">
                <span className="text-4xl font-bold">${price}</span>
                <span className="text-slate-500">/{billingCycle === "yearly" ? "yr" : "mo"}</span>
              </p>
              <ul className="mt-6 space-y-3">
                {features(plan).map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-brand-500" /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.slug)}
                disabled={isCurrent || checkoutLoading === plan.slug}
                className={`mt-8 w-full ${plan.is_popular ? "btn-primary" : "btn-secondary"}`}
              >
                {isCurrent ? "Current plan" : checkoutLoading === plan.slug ? "Redirecting..." : "Subscribe"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
