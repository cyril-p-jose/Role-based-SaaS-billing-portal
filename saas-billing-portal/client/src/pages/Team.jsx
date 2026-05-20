import { useEffect, useState } from "react";
import { UserPlus, Trash2 } from "lucide-react";
import { teamAPI } from "../services/api";

const roleLabels = {
  admin: "Admin",
  billing_manager: "Billing Manager",
  customer: "Customer",
};

const statusStyles = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
};

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", role: "customer" });

  const loadTeam = () => {
    teamAPI.getTeam().then((res) => {
      setMembers(res.data.members);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await teamAPI.invite(inviteForm);
      setInviteForm({ email: "", role: "customer" });
      setShowInvite(false);
      loadTeam();
    } catch (err) {
      alert(err.response?.data?.error || "Invite failed");
    }
  };

  const handleRemove = async (id) => {
    if (!confirm("Remove this team member?")) return;
    await teamAPI.remove(id);
    loadTeam();
  };

  const handleRoleChange = async (id, role) => {
    await teamAPI.updateRole(id, { role });
    loadTeam();
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-end">
        <button onClick={() => setShowInvite(!showInvite)} className="btn-primary">
          <UserPlus className="h-4 w-4" /> Invite member
        </button>
      </div>

      {showInvite && (
        <form onSubmit={handleInvite} className="glass-card space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <input
                type="email"
                className="input-field"
                value={inviteForm.email}
                onChange={(e) => setInviteForm((p) => ({ ...p, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Role</label>
              <select
                className="input-field"
                value={inviteForm.role}
                onChange={(e) => setInviteForm((p) => ({ ...p, role: e.target.value }))}
              >
                <option value="customer">Customer</option>
                <option value="billing_manager">Billing Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn-primary">Send invite</button>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <div key={member.id} className="glass-card">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-lg font-bold text-brand-600">
                  {(member.full_name || member.email)?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold">{member.full_name || member.email}</p>
                  <p className="text-sm text-slate-500">{member.user_email || member.email}</p>
                </div>
              </div>
              {member.status !== "removed" && (
                <button
                  onClick={() => handleRemove(member.id)}
                  className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className={`badge capitalize ${statusStyles[member.status]}`}>
                {member.status}
              </span>
              <select
                value={member.role}
                onChange={(e) => handleRoleChange(member.id, e.target.value)}
                className="rounded-lg border border-slate-200 bg-transparent px-2 py-1 text-sm dark:border-slate-700"
              >
                {Object.entries(roleLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
