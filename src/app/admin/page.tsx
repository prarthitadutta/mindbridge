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
  phone: string;
  contact_email: string;
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
  const [patientAnnouncement, setPatientAnnouncement] = useState("");
  const [therapistAnnouncement, setTherapistAnnouncement] = useState("");
  const [savingAnnouncement, setSavingAnnouncement] = useState(false);

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
    const [therapistsRes, usersRes, bookingsRes, announcementsRes] = await Promise.all([
      supabase.from("therapist_profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("announcements").select("*"),
    ]);

    setTherapists(therapistsRes.data || []);
    setUsers(usersRes.data || []);
    setBookings(bookingsRes.data || []);

    const announcements = announcementsRes.data || [];
    const patientMsg = announcements.find((a) => a.role === "user");
    const therapistMsg = announcements.find((a) => a.role === "therapist");
    setPatientAnnouncement(patientMsg?.content || "");
    setTherapistAnnouncement(therapistMsg?.content || "");

    setLoading(false);
  };

  const saveAnnouncement = async (role: "user" | "therapist", content: string) => {
    setSavingAnnouncement(true);
    const { error } = await supabase
      .from("announcements")
      .update({ content, updated_at: new Date().toISOString() })
      .eq("role", role);

    if (error) {
      toast.error("Failed to save");
    } else {
      toast.success("Announcement updated!");
    }
    setSavingAnnouncement(false);
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

      if (verified) {
        try {
          const res = await fetch("/api/get-therapist-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: therapist.user_id }),
          });
          const { email } = await res.json();
          if (email) {
            await fetch("/api/send-verification-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                therapistEmail: email,
                therapistName: therapist.full_name,
              }),
            });
          }
        } catch (e) {
          console.error("Failed to send verification email:", e);
        }
      }
    }

    if (error) {
      toast.error("Failed to update");
    } else {
      toast.success(verified ? "Therapist verified! Welcome email sent." : "Verification removed");
      setTherapists((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_verified: verified } : t))
      );
    }
  };

  const updateUserRole = async (id: string, role: string) => {
    const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
    if (error) {
      toast.error("Failed to update role");
    } else {
      toast.success(`Role updated to ${role}`);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    }
  };

  const deleteTherapist = async (id: string) => {
    if (!confirm("Are you sure you want to delete this therapist profile?")) return;
    const { error } = await supabase.from("therapist_profiles").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Therapist deleted");
      setTherapists((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const resetPendingUser = async (userId: string, name: string) => {
    if (!confirm(`Reset "${name}" back to a regular user? They will need to sign up as a therapist again.`)) return;
    const { error } = await supabase.from("profiles").update({ role: "user" }).eq("id", userId);
    if (error) {
      toast.error("Failed to reset");
    } else {
      toast.success(`${name} reset to user`);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: "user" } : u)));
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "#F4F1EB" }}>
        <div style={{ color: "#3D2B1F", opacity: 0.5 }}>Loading...</div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4" style={{ background: "#F4F1EB" }}>
        <div className="text-center">
          <p className="text-5xl mb-4">🔒</p>
          <h2 className="text-xl font-bold mb-2" style={{ color: "#3D2B1F" }}>Access Denied</h2>
          <p className="text-sm mb-6" style={{ color: "#7a6a5a" }}>You need admin privileges to access this page.</p>
          <Link href="/dashboard" className="font-semibold px-6 py-3 rounded-xl transition text-white" style={{ background: "#2D6A4F" }}>
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const therapistUserIds = new Set(therapists.map((t) => t.user_id));
  const incompleteOnboarding = users.filter(
    (u) => u.role === "pending_therapist" && !therapistUserIds.has(u.id)
  );

  const stats = [
    { label: "Total Users", value: users.length, bg: "#e8f5ee", text: "#2D6A4F", icon: "👥" },
    { label: "Therapists", value: therapists.length, bg: "#fef3ee", text: "#c45a3c", icon: "🧑‍⚕️" },
    { label: "Pending", value: therapists.filter((t) => !t.is_verified).length, bg: "#fdf4e7", text: "#b45e00", icon: "⏳" },
    { label: "Bookings", value: bookings.length, bg: "#e8f5ee", text: "#2D6A4F", icon: "📅" },
    { label: "Confirmed", value: bookings.filter((b) => b.status === "confirmed").length, bg: "#fef3ee", text: "#c45a3c", icon: "✅" },
    {
      label: "Revenue (₹)",
      value: bookings.filter((b) => b.status === "completed" && !b.is_pro_bono).reduce((sum, b) => sum + b.fee, 0).toLocaleString(),
      bg: "#fdf4e7", text: "#b45e00", icon: "💰",
    },
  ];

  return (
    <main className="min-h-screen" style={{ background: "#F4F1EB" }}>
      <nav className="flex items-center justify-between px-8 py-5 bg-white border-b" style={{ borderColor: "#d6cfc4" }}>
        <Link href="/" className="text-2xl font-bold" style={{ color: "#2D6A4F" }}>
          Mind<span style={{ color: "#E76F51" }}>Bridge</span>
          <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-normal" style={{ background: "#fef3ee", color: "#c45a3c" }}>Admin</span>
        </Link>
        <Link href="/dashboard" className="text-sm transition" style={{ color: "#7a6a5a" }}>
          Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#3D2B1F" }}>Admin Panel</h1>
        <p className="text-sm mb-8" style={{ color: "#7a6a5a" }}>Manage your platform from here.</p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: s.bg }}>
              <p className="text-2xl mb-1">{s.icon}</p>
              <p className="text-xl font-bold" style={{ color: s.text }}>{s.value}</p>
              <p className="text-xs font-medium mt-1" style={{ color: s.text, opacity: 0.8 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-xl p-6 mb-8" style={{ border: "1px solid #d6cfc4" }}>
          <h2 className="font-semibold mb-1" style={{ color: "#3D2B1F" }}>📢 Dashboard Announcements</h2>
          <p className="text-xs mb-5" style={{ color: "#7a6a5a" }}>These messages appear at the top of the dashboard for patients and therapists respectively.</p>

          <div className="flex flex-col gap-5">
            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: "#3D2B1F" }}>Message for Patients</label>
              <textarea
                value={patientAnnouncement}
                onChange={(e) => setPatientAnnouncement(e.target.value)}
                rows={3}
                placeholder="Write something for your patients..."
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
                style={{ border: "1px solid #d6cfc4", color: "#3D2B1F" }}
              />
              <button
                onClick={() => saveAnnouncement("user", patientAnnouncement)}
                disabled={savingAnnouncement}
                className="mt-2 text-white text-xs font-semibold px-4 py-2 rounded-lg transition disabled:opacity-60"
                style={{ background: "#2D6A4F" }}
              >
                {savingAnnouncement ? "Saving..." : "Save Patient Message"}
              </button>
            </div>

            <div style={{ borderTop: "1px solid #e8e0d8", paddingTop: "1.25rem" }}>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: "#3D2B1F" }}>Message for Therapists</label>
              <textarea
                value={therapistAnnouncement}
                onChange={(e) => setTherapistAnnouncement(e.target.value)}
                rows={3}
                placeholder="Write something for your therapists..."
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
                style={{ border: "1px solid #d6cfc4", color: "#3D2B1F" }}
              />
              <button
                onClick={() => saveAnnouncement("therapist", therapistAnnouncement)}
                disabled={savingAnnouncement}
                className="mt-2 text-white text-xs font-semibold px-4 py-2 rounded-lg transition disabled:opacity-60"
                style={{ background: "#E76F51" }}
              >
                {savingAnnouncement ? "Saving..." : "Save Therapist Message"}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["overview", "therapists", "users", "bookings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-lg text-sm font-medium capitalize transition"
              style={{
                background: activeTab === tab ? "#2D6A4F" : "white",
                color: activeTab === tab ? "white" : "#3D2B1F",
                border: activeTab === tab ? "1px solid #2D6A4F" : "1px solid #d6cfc4",
              }}
            >
              {tab}
              {tab === "therapists" && incompleteOnboarding.length > 0 && (
                <span className="ml-1.5 text-white text-xs rounded-full px-1.5 py-0.5" style={{ background: "#E76F51" }}>
                  {incompleteOnboarding.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6" style={{ border: "1px solid #d6cfc4" }}>
              <h3 className="font-semibold mb-4" style={{ color: "#3D2B1F" }}>Booking Breakdown</h3>
              {["pending", "confirmed", "completed", "rejected"].map((status) => {
                const count = bookings.filter((b) => b.status === status).length;
                const pct = bookings.length ? Math.round((count / bookings.length) * 100) : 0;
                const colors: Record<string, string> = {
                  pending: "#D97706",
                  confirmed: "#2D6A4F",
                  completed: "#4A90D9",
                  rejected: "#E76F51",
                };
                return (
                  <div key={status} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize" style={{ color: "#7a6a5a" }}>{status}</span>
                      <span className="font-medium" style={{ color: "#3D2B1F" }}>{count} ({pct}%)</span>
                    </div>
                    <div className="w-full rounded-full h-1.5" style={{ background: "#e8e0d8" }}>
                      <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: colors[status] }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-xl p-6" style={{ border: "1px solid #d6cfc4" }}>
              <h3 className="font-semibold mb-4" style={{ color: "#3D2B1F" }}>Recent Bookings</h3>
              {bookings.slice(0, 5).map((b) => (
                <div key={b.id} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid #f0ebe4" }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#3D2B1F" }}>{b.therapist_name}</p>
                    <p className="text-xs" style={{ color: "#7a6a5a" }}>{new Date(b.created_at).toLocaleDateString("en-IN")}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full font-medium" style={{
                    background: b.status === "confirmed" ? "#e8f5ee" : b.status === "pending" ? "#fdf4e7" : b.status === "completed" ? "#e8f0fb" : "#fef3ee",
                    color: b.status === "confirmed" ? "#2D6A4F" : b.status === "pending" ? "#b45e00" : b.status === "completed" ? "#3b5bdb" : "#c45a3c",
                  }}>
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
            {incompleteOnboarding.length > 0 && (
              <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #f0c070" }}>
                <div className="p-5" style={{ background: "#fdf4e7", borderBottom: "1px solid #f0c070" }}>
                  <h3 className="font-semibold" style={{ color: "#b45e00" }}>Incomplete Onboarding ({incompleteOnboarding.length})</h3>
                  <p className="text-xs mt-1" style={{ color: "#b45e00", opacity: 0.8 }}>These users signed up as therapists but never filled their profile.</p>
                </div>
                <div>
                  {incompleteOnboarding.map((u) => (
                    <div key={u.id} className="p-5 flex items-center justify-between flex-wrap gap-4" style={{ borderBottom: "1px solid #f0ebe4" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: "#fdf4e7", color: "#b45e00" }}>
                          {u.full_name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="font-medium text-sm" style={{ color: "#3D2B1F" }}>{u.full_name || "Unknown"}</p>
                          <p className="text-xs" style={{ color: "#7a6a5a" }}>{u.id.substring(0, 8)}...</p>
                        </div>
                      </div>
                      <button
                        onClick={() => resetPendingUser(u.id, u.full_name || "this user")}
                        className="text-xs font-semibold px-4 py-2 rounded-lg transition"
                        style={{ background: "#fdf4e7", color: "#b45e00", border: "1px solid #f0c070" }}
                      >
                        Reset to User
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #d6cfc4" }}>
              <div className="p-5" style={{ borderBottom: "1px solid #e8e0d8" }}>
                <h3 className="font-semibold" style={{ color: "#3D2B1F" }}>All Therapists ({therapists.length})</h3>
                <p className="text-xs mt-1" style={{ color: "#7a6a5a" }}>Verify therapists to grant them full platform access</p>
              </div>
              <div>
                {therapists.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-sm" style={{ color: "#7a6a5a" }}>No therapists yet</p>
                  </div>
                ) : (
                  therapists.map((t) => (
                    <div key={t.id} className="p-5 transition" style={{ borderBottom: "1px solid #f0ebe4" }}>
                      <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold" style={{ background: "#2D6A4F" }}>
                            {t.full_name?.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                              <p className="font-semibold text-sm" style={{ color: "#3D2B1F" }}>{t.full_name}</p>
                              {t.is_verified ? (
                                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#e8f5ee", color: "#2D6A4F" }}>Verified</span>
                              ) : (
                                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#fdf4e7", color: "#b45e00" }}>Pending</span>
                              )}
                              {t.is_pro_bono && (
                                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#fef3ee", color: "#c45a3c" }}>Pro Bono</span>
                              )}
                            </div>
                            <p className="text-xs" style={{ color: "#7a6a5a" }}>{t.education}</p>
                            <p className="text-xs" style={{ color: "#7a6a5a" }}>📍 {t.location}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {t.specialties?.slice(0, 3).map((s) => (
                                <span key={s} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#e8f5ee", color: "#2D6A4F" }}>{s}</span>
                              ))}
                            </div>
                            {(t.phone || t.contact_email) && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {t.phone && (
                                  <span className="text-xs px-3 py-1 rounded-full" style={{ background: "#f4f1eb", color: "#3D2B1F", border: "1px solid #d6cfc4" }}>📞 {t.phone}</span>
                                )}
                                {t.contact_email && (
                                  <span className="text-xs px-3 py-1 rounded-full" style={{ background: "#f4f1eb", color: "#3D2B1F", border: "1px solid #d6cfc4" }}>✉️ {t.contact_email}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {!t.is_verified ? (
                            <button
                              onClick={() => verifyTherapist(t.id, true)}
                              className="text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
                              style={{ background: "#2D6A4F" }}
                            >
                              Verify and Approve
                            </button>
                          ) : (
                            <button
                              onClick={() => verifyTherapist(t.id, false)}
                              className="text-xs font-semibold px-4 py-2 rounded-lg transition"
                              style={{ background: "#f4f1eb", color: "#3D2B1F", border: "1px solid #d6cfc4" }}
                            >
                              Unverify
                            </button>
                          )}
                          <button
                            onClick={() => deleteTherapist(t.id)}
                            className="text-xs font-semibold px-4 py-2 rounded-lg transition"
                            style={{ background: "#fef3ee", color: "#c45a3c", border: "1px solid #f5c4b0" }}
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
          <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #d6cfc4" }}>
            <div className="p-5" style={{ borderBottom: "1px solid #e8e0d8" }}>
              <h3 className="font-semibold" style={{ color: "#3D2B1F" }}>All Users ({users.length})</h3>
            </div>
            <div>
              {users.map((u) => (
                <div key={u.id} className="p-4 flex items-center justify-between flex-wrap gap-3" style={{ borderBottom: "1px solid #f0ebe4" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: "#e8f5ee", color: "#2D6A4F" }}>
                      {u.full_name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-medium text-sm" style={{ color: "#3D2B1F" }}>{u.full_name || "Unknown"}</p>
                      <p className="text-xs" style={{ color: "#7a6a5a" }}>{u.id.substring(0, 8)}...</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-1 rounded-full font-medium" style={{
                      background: u.role === "admin" ? "#fef3ee" : u.role === "therapist" ? "#e8f5ee" : u.role === "pending_therapist" ? "#fdf4e7" : "#f4f1eb",
                      color: u.role === "admin" ? "#c45a3c" : u.role === "therapist" ? "#2D6A4F" : u.role === "pending_therapist" ? "#b45e00" : "#3D2B1F",
                    }}>
                      {u.role || "user"}
                    </span>
                    <select
                      value={u.role || "user"}
                      onChange={(e) => updateUserRole(u.id, e.target.value)}
                      className="text-xs rounded-lg px-2 py-1.5 focus:outline-none"
                      style={{ border: "1px solid #d6cfc4", color: "#3D2B1F" }}
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
          <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #d6cfc4" }}>
            <div className="p-5" style={{ borderBottom: "1px solid #e8e0d8" }}>
              <h3 className="font-semibold" style={{ color: "#3D2B1F" }}>All Bookings ({bookings.length})</h3>
            </div>
            <div>
              {bookings.map((b) => (
                <div key={b.id} className="p-4 flex items-center justify-between flex-wrap gap-3" style={{ borderBottom: "1px solid #f0ebe4" }}>
                  <div>
                    <p className="font-medium text-sm" style={{ color: "#3D2B1F" }}>{b.therapist_name}</p>
                    <p className="text-xs" style={{ color: "#7a6a5a" }}>
                      {new Date(b.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} at {b.time}
                    </p>
                    <p className="text-xs" style={{ color: "#7a6a5a" }}>{b.is_pro_bono ? "Free" : `₹${b.fee}`}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full font-medium" style={{
                    background: b.status === "confirmed" ? "#e8f5ee" : b.status === "pending" ? "#fdf4e7" : b.status === "completed" ? "#e8f0fb" : "#fef3ee",
                    color: b.status === "confirmed" ? "#2D6A4F" : b.status === "pending" ? "#b45e00" : b.status === "completed" ? "#3b5bdb" : "#c45a3c",
                  }}>
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