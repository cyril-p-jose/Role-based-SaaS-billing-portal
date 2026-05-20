import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../layouts/AuthLayout";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    organizationName: "",
    role: "customer",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        organizationName: form.organizationName,
        role: form.role,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start managing billing in minutes">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-400">
            {error}
          </div>
        )}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Full name</label>
          <input name="fullName" className="input-field" value={form.fullName} onChange={handleChange} required />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <input name="email" type="email" className="input-field" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Password</label>
          <input name="password" type="password" className="input-field" value={form.password} onChange={handleChange} minLength={8} required />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Organization name</label>
          <input name="organizationName" className="input-field" value={form.organizationName} onChange={handleChange} placeholder="Acme Inc." />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Role</label>
          <select name="role" className="input-field" value={form.role} onChange={handleChange}>
            <option value="customer">Customer</option>
            <option value="billing_manager">Billing Manager</option>
          </select>
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
