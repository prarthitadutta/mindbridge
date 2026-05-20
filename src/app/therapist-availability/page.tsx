"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import toast from "react-hot-toast";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM",
];

type Availability = {
  [day: string]: string[];
};

export default function TherapistAvailability() {
  const supabase = createClient();
  const [availability, setAvailability] = useState<Availability>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [therapistProfile, setTherapistProfile] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: tProfiles } = await supabase
      .from("therapist_profiles")
      .select("*")
      .eq("user_id", user.id)
      .limit(1);

    const tProfile = tProfiles?.[0] || null;
    setTherapistProfile(tProfile);

    if (tProfile?.availability) {
      setAvailability(tProfile.availability);
    } else {
      // Default — empty availability
      const defaultAvail: Availability = {};
      DAYS.forEach((day) => (defaultAvail[day] = []));
      setAvailability(defaultAvail);
    }

    setLoading(false);
  };

  const toggleSlot = (day: string, slot: string) => {
    setAvailability((prev) => {
      const current = prev[day] || [];
      const updated = current.includes(slot)
        ? current.filter((s) => s !== slot)
        : [...current, slot];
      return { ...prev, [day]: updated };
    });
  };

  const toggleDay = (day: string) => {
    setAvailability((prev) => {
      const current = prev[day] || [];
      // If all slots selected, clear. Otherwise select all.
      const updated = current.length === TIME_SLOTS.length ? [] : [...TIME_SLOTS];
      return { ...prev, [day]: updated };
    });
  };

  const saveAvailability = async () => {
    if (!therapistProfile) return;
    setSaving(true);

    const { error } = await supabase
      .from("therapist_profiles")
      .update({ availability })
      .eq("id", therapistProfile.id);

    if (error) {
      toast.error("Failed to save availability");
    } else {
      toast.success("Availability saved! 🎉");
    }
    setSaving(false);
  };

  const totalSlots = Object.values(availability).reduce(
    (sum, slots) => sum + slots.length, 0
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fdf6f0] flex items-center justify-center">
        <div className="text-gray-400 animate-pulse">Loading availability...</div>
      </main>
    );
  }

  if (!therapistProfile) {
    return (
      <main className="min-h-screen bg-[#fdf6f0] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-5xl mb-4">🌸</p>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No therapist profile found</h2>
          <p className="text-gray-500 text-sm mb-6">Complete your onboarding first.</p>
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
        <Link
          href="/therapist-dashboard"
          className="text-sm font-medium text-gray-500 hover:text-[#4A90D9] transition"
        >
          ← Therapist Dashboard
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Set Your Availability</h1>
            <p className="text-gray-500 text-sm mt-1">
              Select the days and times you're available for sessions
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {totalSlots} slot{totalSlots !== 1 ? "s" : ""} selected
            </span>
            <button
              onClick={saveAvailability}
              disabled={saving}
              className="bg-[#4A90D9] text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-[#357ABD] transition disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Availability"}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {DAYS.map((day) => {
            const selectedSlots = availability[day] || [];
            const allSelected = selectedSlots.length === TIME_SLOTS.length;
            const someSelected = selectedSlots.length > 0 && !allSelected;

            return (
              <div
                key={day}
                className={`bg-white rounded-2xl p-6 shadow-sm border transition ${
                  selectedSlots.length > 0
                    ? "border-[#4A90D9]/30"
                    : "border-gray-100"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleDay(day)}
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition ${
                        allSelected
                          ? "bg-[#4A90D9] border-[#4A90D9]"
                          : someSelected
                          ? "bg-[#4A90D9]/30 border-[#4A90D9]"
                          : "border-gray-300"
                      }`}
                    >
                      {allSelected && <span className="text-white text-xs">✓</span>}
                      {someSelected && <span className="text-white text-xs">−</span>}
                    </button>
                    <h3 className="font-semibold text-gray-800">{day}</h3>
                  </div>
                  <span className="text-xs text-gray-400">
                    {selectedSlots.length > 0
                      ? `${selectedSlots.length} slot${selectedSlots.length !== 1 ? "s" : ""} selected`
                      : "Not available"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = selectedSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        onClick={() => toggleSlot(day, slot)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                          isSelected
                            ? "bg-[#4A90D9] text-white border-[#4A90D9]"
                            : "bg-white text-gray-600 border-gray-200 hover:border-[#4A90D9]"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-700">
          💡 Users will only see your selected time slots when booking a session with you.
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={saveAvailability}
            disabled={saving}
            className="bg-[#C084A0] text-white font-semibold px-8 py-3 rounded-xl hover:bg-[#a8607f] transition disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Availability 🌸"}
          </button>
        </div>
      </div>
    </main>
  );
}