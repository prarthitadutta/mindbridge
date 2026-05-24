"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import toast from "react-hot-toast";

type Therapist = {
  id: string;
  user_id: string;
  full_name: string;
  education: string;
  location: string;
  specialties: string[];
  languages: string[];
  session_fee: number;
  is_pro_bono: boolean;
  is_verified: boolean;
  is_available: boolean;
  created_at: string;
};

type User = {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
};

type Booking = {
  id: string;
  therapist_name: string;
  date: string;
  time: string;
  status: string;
  fee: number;
  is_pro_bono: boolean;
  created_at: string;
};

export default function AdminPanel() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setIsAdmin(true);
    fetchAllData();
  };

  const fetchAllData = async () => {
    const [therapistsRes, usersRes, bookingsRes] = await Promise.all([
      supabase.from("therapist_profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("bookings").select("*").order("created_at", { ascending: false }),
    ]);

    setTherapists(therapistsRes.data || []);
    setUsers(usersRes.data || []);
    setBookings(bookingsRes.data || []);
    setLoading(false);
  };

  const verifyTherapist = async (id: string, verified: boolean) => {
    const { error } = await supabase
      .from("therapist_profiles")
      .update({ is_verified: verified })
      .eq("id", id);

    const therapist = therapists.find((t) => t.id === id);
    if (therapist) {
      await supabase
        .from("profiles")
        .update({ role: verified ? "therapist" : "pending_therapist" })
        .eq("id", therapist.user_id);
    }

    if (error) {
      toast.error("Failed to update");
    } else {
      toast.success(
        verified
          ? "Therapist verified ✅ They now have full access!"
          : "Verification removed"
      );
      setTherapists((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_verified: verified } : t))
      );
    }
  };

  const updateUserRole = async (id: string, role: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update role");
    } else {
      toast.success(`Role updated to ${role} ✅`);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role } : u))
      );
    }
  };

  const deleteTherapist = async (id: string) => {
    if (!confirm("Are you sure you want to delete this therapist profile?")) return;
    const { error } = await supabase
      .from("therapist_profiles")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Therapist deleted");
      setTherapists((prev) => prev.filter((t) => t.id !== id));
    }
  };

  // Reset a stuck pending_therapist back to user role
  const resetPendingUser = async (userId: string, name: string) => {
    if (!confirm(`Reset "${name}" back to a regular user? They will need to sign up as a therapist again.`)) return;
    const { error } = await supabase
      .from("profiles")
      .update({ role: "user" })
      .eq("id", userId);

    if (error) {
      toast.error("Failed to reset");
    } else {
      toast.success(`${name} reset to user ✅`);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: "user" } : u))
      );
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fdf6f0] flex items-center justify-center">
        <div className="text-gray-400 animate-pulse">Loading admin panel...</div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-[#fdf6f0] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-5xl mb-4">🔒</p>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-500 text-sm mb-6">
            You need admin privileges to access this page.
          </p>
          <Link
            href="/dashboard"
            className="bg-[#4A90D9] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#357ABD] transition"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  // Users who have pending_therapist role but never completed onboarding
  const therapistUserIds = new Set(therapists.map((t) => t.user_id));
  const incompleteOnboarding = users.filter(
    (u) => u.role === "pending_therapist" && !therapistUserIds.has(u.id)
  );

  const stats = [
    { label: "Total Users", value: users.length, color: "bg-blue-50 text-blue-700", icon: "👥" },
    { label: "Therapists", value: therapists.length, color: "bg-purple-50 text-purple-700", icon: "🧑‍⚕️" },
    { label: "Pending Verification", value: therapists.filter((t) => !t.is_verified).length, color: "bg-amber-50 text-amber-700", icon: "⏳" },
    { label: "Total Bookings", value: bookings.length, color: "bg-green-50 text-green-700", icon: "📅" },
    { label: "Confirmed Sessions", value: bookings.filter((b) => b.status === "confirmed").length, color: "bg-teal-50 text-teal-700", icon: "✅" },
    {
      label: "Revenue (₹)",
      value: bookings
        .filter((b) => b.status === "completed" && !b.is_pro_bono)
        .reduce((sum, b) => sum + b.fee, 0)
        .toLocaleString(),
      color: "bg-rose-50 text-rose-700",
      icon: "💰",
    },
  ];

  return (
    <main className="min-h-screen bg-[#fdf6f0]">
      <nav className="flex items-center justify-between px-8 py-5 bg-white/80 backdrop-blur-sm shadow-sm">
        <Link href="/" className="text-2xl font-bold text-[#4A90D9]">
          Mind<span className="text-[#C084A0]">Bridge</span>
          <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-normal">
            Admin
          </span>
        </Link>
        <Link
          href="/dashboard"
          className="text-sm font-medium text-gray-500 hover:text-[#4A90D9] transition"
        >
          ← Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Admin Panel</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className={`${s.color} rounded-2xl p-4 text-center`}>
              <p className="text-2xl mb-1">{s.icon}</p>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["overview", "therapists", "users", "bookings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition ${
                activeTab === tab
                  ? "bg-[#4A90D9] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {tab}
              {/* Badge for incomplete onboarding on therapists tab */}
              {tab === "therapists" && incompleteOnboarding.length > 0 && (
                <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {incompleteOnboarding.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Booking Status Breakdown</h3>
              {["pending", "confirmed", "completed", "rejected"].map((status) => {
                const count = bookings.filter((b) => b.status === status).length;
                const pct = bookings.length
                  ? Math.round((count / bookings.length) * 100)
                  : 0;
                const colors: Record<string, string> = {
                  pending: "bg-amber-400",
                  confirmed: "bg-green-400",
                  completed: "bg-blue-400",
                  rejected: "bg-red-400",
                };
                return (
                  <div key={status} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize text-gray-600">{status}</span>
                      <span className="font-medium text-gray-800">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`${colors[status]} h-2 rounded-full`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Recent Bookings</h3>
              {bookings.slice(0, 5).map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-700">{b.therapist_name}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(b.created_at).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      b.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : b.status === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : b.status === "completed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Therapists Tab */}
        {activeTab === "therapists" && (
          <div className="flex flex-col gap-6">

            {/* ── Incomplete Onboarding Section ── */}
            {incompleteOnboarding.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-amber-200 overflow-hidden">
                <div className="p-6 border-b border-amber-100 bg-amber-50">
                  <h3 className="font-semibold text-amber-800">
                    ⚠️ Incomplete Onboarding ({incompleteOnboarding.length})
                  </h3>
                  <p className="text-xs text-amber-600 mt-1">
                    These users registered as therapists but never filled in their profile. They are stuck and cannot be found by patients.
                  </p>
                </div>
                <div className="divide-y divide-gray-50">
                  {incompleteOnboarding.map((u) => (
                    <div key={u.id} className="p-5 hover:bg-gray-50 transition flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
                          {u.full_name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{u.full_name || "Unknown"}</p>
                          <p className="text-xs text-gray-400">{u.id.substring(0, 8)}...</p>
                          <p className="text-xs text-amber-600 mt-0.5">Never completed therapist onboarding</p>
                        </div>
                      </div>
                      <button
                        onClick={() => resetPendingUser(u.id, u.full_name || "this user")}
                        className="bg-amber-100 text-amber-700 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-amber-200 transition"
                      >
                        Reset to User
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Verified / Pending Therapists ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">
                  All Therapists ({therapists.length})
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Verify therapists to grant them full access to MindBridge
                </p>
              </div>
              <div className="divide-y divide-gray-50">
                {therapists.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-3xl mb-2">🧑‍⚕️</p>
                    <p className="text-gray-500 text-sm">No therapists yet</p>
                  </div>
                ) : (
                  therapists.map((t) => (
                    <div key={t.id} className="p-6 hover:bg-gray-50 transition">
                      <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4A90D9] to-[#7B5EA7] flex items-center justify-center text-white font-bold text-lg">
                            {t.full_name?.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-gray-800">{t.full_name}</p>
                              {t.is_verified ? (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                  ✓ Verified
                                </span>
                              ) : (
                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                  ⏳ Pending
                                </span>
                              )}
                              {t.is_pro_bono && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                  Pro Bono
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400">{t.education}</p>
                            <p className="text-xs text-gray-400">📍 {t.location}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {t.specialties?.slice(0, 3).map((s) => (
                                <span
                                  key={s}
                                  className="text-xs bg-[#f0f7ff] text-[#4A90D9] px-2 py-0.5 rounded-full"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {!t.is_verified ? (
                            <button
                              onClick={() => verifyTherapist(t.id, true)}
                              className="bg-green-500 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-green-600 transition"
                            >
                              ✓ Verify & Approve
                            </button>
                          ) : (
                            <button
                              onClick={() => verifyTherapist(t.id, false)}
                              className="bg-gray-100 text-gray-600 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-gray-200 transition"
                            >
                              Unverify
                            </button>
                          )}
                          <button
                            onClick={() => deleteTherapist(t.id)}
                            className="bg-red-100 text-red-600 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-red-200 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">All Users ({users.length})</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="p-4 hover:bg-gray-50 transition flex items-center justify-between flex-wrap gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-sm font-bold text-purple-700">
                      {u.full_name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">
                        {u.full_name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-400">{u.id.substring(0, 8)}...</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        u.role === "admin"
                          ? "bg-red-100 text-red-700"
                          : u.role === "therapist"
                          ? "bg-green-100 text-green-700"
                          : u.role === "pending_therapist"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {u.role || "user"}
                    </span>
                    <select
                      value={u.role || "user"}
                      onChange={(e) => updateUserRole(u.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#4A90D9]"
                    >
                      <option value="user">User</option>
                      <option value="pending_therapist">Pending Therapist</option>
                      <option value="therapist">Therapist</option>
                      <option value="admin">Admin</option>
                      <option value="volunteer">Volunteer</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">
                All Bookings ({bookings.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 hover:bg-gray-50 transition flex items-center justify-between flex-wrap gap-3"
                >
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{b.therapist_name}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(b.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      at {b.time}
                    </p>
                    <p className="text-xs text-gray-400">
                      {b.is_pro_bono ? "Free" : `₹${b.fee}`}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      b.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : b.status === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : b.status === "completed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}