"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import toast from "react-hot-toast";

type Booking = {
  id: string;
  user_id: string;
  therapist_name: string;
  date: string;
  time: string;
  session_type: string;
  concern: string;
  notes: string;
  fee: number;
  is_pro_bono: boolean;
  status: string;
  created_at: string;
};

type Profile = {
  full_name: string;
  role: string;
};

export default function TherapistDashboard() {
  const supabase = createClient();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [therapistProfile, setTherapistProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profileData } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .maybeSingle();
    setProfile(profileData);

    const { data: tProfiles } = await supabase
      .from("therapist_profiles")
      .select("*")
      .eq("user_id", user.id)
      .limit(1);

    const tProfile = tProfiles?.[0] || null;
    setTherapistProfile(tProfile);

    if (tProfile) {
      const { data: bookingsData } = await supabase
        .from("bookings")
        .select("*")
        .eq("therapist_id", tProfile.id)
        .order("created_at", { ascending: false });
      setBookings(bookingsData || []);
    }

    setLoading(false);
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", bookingId);

    if (error) {
      toast.error("Failed to update booking");
    } else {
      toast.success(`Booking ${status} ✅`);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
      );
    }
  };

  const updateAvailability = async (isAvailable: boolean) => {
    if (!therapistProfile) return;
    const { error } = await supabase
      .from("therapist_profiles")
      .update({ is_available: isAvailable })
      .eq("id", therapistProfile.id);

    if (error) {
      toast.error("Failed to update availability");
    } else {
      toast.success(isAvailable ? "You are now available 🟢" : "You are now unavailable 🔴");
      setTherapistProfile({ ...therapistProfile, is_available: isAvailable });
    }
  };

  const filtered = bookings.filter((b) => {
    if (filter === "all") return true;
    return b.status === filter;
  });

  const statusColor = (status: string) => {
    if (status === "pending") return "bg-amber-100 text-amber-700";
    if (status === "confirmed") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    if (status === "completed") return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fdf6f0] flex items-center justify-center">
        <div className="text-gray-400 animate-pulse">Loading your dashboard...</div>
      </main>
    );
  }

  if (!therapistProfile) {
    return (
      <main className="min-h-screen bg-[#fdf6f0] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-5xl mb-4">🌸</p>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No therapist profile found</h2>
          <p className="text-gray-500 text-sm mb-6">You need to complete your therapist onboarding first.</p>
          <Link
            href="/therapist-onboarding"
            className="bg-[#4A90D9] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#357ABD] transition"
          >
            Complete Onboarding
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fdf6f0]">
      <nav className="flex items-center justify-between px-8 py-5 bg-white/80 backdrop-blur-sm shadow-sm">
        <Link href="/" className="text-2xl font-bold text-[#4A90D9]">
          Mind<span className="text-[#C084A0]">Bridge</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{therapistProfile.full_name}</span>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-500 hover:text-[#4A90D9] transition"
          >
            ← Back
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Bookings", value: bookings.length, color: "bg-blue-50 text-blue-700" },
            { label: "Pending", value: bookings.filter((b) => b.status === "pending").length, color: "bg-amber-50 text-amber-700" },
            { label: "Confirmed", value: bookings.filter((b) => b.status === "confirmed").length, color: "bg-green-50 text-green-700" },
            { label: "Completed", value: bookings.filter((b) => b.status === "completed").length, color: "bg-purple-50 text-purple-700" },
          ].map((s) => (
            <div key={s.label} className={`${s.color} rounded-2xl p-5 text-center`}>
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-sm font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Profile card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#4A90D9] to-[#7B5EA7] flex items-center justify-center text-white font-bold text-xl">
              {therapistProfile.full_name?.charAt(0) || "T"}
            </div>
            <div>
              <h2 className="font-semibold text-gray-800 text-lg">{therapistProfile.full_name}</h2>
              <p className="text-sm text-gray-400">{therapistProfile.education}</p>
              <p className="text-xs text-gray-400 mt-0.5">📍 {therapistProfile.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-gray-600">Availability:</span>
            <button
              onClick={() => updateAvailability(!therapistProfile.is_available)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                therapistProfile.is_available
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
            >
              {therapistProfile.is_available ? "🟢 Available" : "🔴 Unavailable"}
            </button>
            <Link
              href="/therapist-onboarding"
              className="text-xs text-[#4A90D9] hover:underline"
            >
              Edit Profile
            </Link>
            <Link
              href="/therapist-availability"
              className="text-xs bg-[#4A90D9] text-white px-3 py-1.5 rounded-full hover:bg-[#357ABD] transition"
            >
              📅 Set Availability
            </Link>
          </div>
        </div>

        {/* Bookings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
            <h2 className="font-semibold text-gray-800 text-lg">Booking Requests</h2>
            <div className="flex gap-2 flex-wrap">
              {["all", "pending", "confirmed", "completed", "rejected"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition ${
                    filter === f
                      ? "bg-[#4A90D9] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-500">No {filter === "all" ? "" : filter} bookings yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map((b) => (
                <div key={b.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-sm font-bold text-purple-700">
                          U
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">Session Request</p>
                          <p className="text-xs text-gray-400">
                            {new Date(b.created_at).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short", year: "numeric",
                            })}
                          </p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor(b.status)}`}>
                          {b.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-xs text-gray-400">Date</p>
                          <p className="text-sm font-medium text-gray-700">
                            {new Date(b.date).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short",
                            })}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-xs text-gray-400">Time</p>
                          <p className="text-sm font-medium text-gray-700">{b.time}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-xs text-gray-400">Type</p>
                          <p className="text-sm font-medium text-gray-700">{b.session_type}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-xs text-gray-400">Fee</p>
                          <p className="text-sm font-medium text-gray-700">
                            {b.is_pro_bono ? "Free" : `₹${b.fee}`}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 bg-blue-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-1">Focus Area</p>
                        <p className="text-sm text-gray-700">{b.concern}</p>
                        {b.notes && (
                          <>
                            <p className="text-xs text-gray-400 mt-2 mb-1">Notes from client</p>
                            <p className="text-sm text-gray-600 italic">{b.notes}</p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    {b.status === "pending" && (
                      <div className="flex flex-col gap-2 min-w-[120px]">
                        <button
                          onClick={() => updateBookingStatus(b.id, "confirmed")}
                          className="bg-green-500 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-green-600 transition"
                        >
                          ✓ Confirm
                        </button>
                        <button
                          onClick={() => updateBookingStatus(b.id, "rejected")}
                          className="bg-red-100 text-red-600 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-red-200 transition"
                        >
                          ✕ Reject
                        </button>
                      </div>
                    )}
                    {b.status === "confirmed" && (
                      <div className="flex flex-col gap-2 min-w-[120px]">
                        <Link
                          href={`/chat/${b.id}`}
                          className="bg-[#4A90D9] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#357ABD] transition text-center"
                        >
                          💬 Chat
                        </Link>
                        <button
                          onClick={() => updateBookingStatus(b.id, "completed")}
                          className="bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-blue-200 transition"
                        >
                          Mark Complete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}