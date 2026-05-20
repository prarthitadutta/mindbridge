"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import SOSModal from "@/components/shared/SOSModal";

const populations = ["All", "Adults", "Teenagers", "Children", "Elderly", "Couples", "Families", "LGBTQ+"];

type Therapist = {
  id: string;
  user_id: string;
  full_name: string;
  bio: string;
  education: string;
  location: string;
  years_experience: number;
  session_fee: number;
  is_pro_bono: boolean;
  is_verified: boolean;
  is_available: boolean;
  specialties: string[];
  languages: string[];
  populations: string[];
  rating: number;
  total_sessions: number;
};

export default function Therapists() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("All");
  const [search, setSearch] = useState("");
  const [proBonoOnly, setProBonoOnly] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchTherapists = async () => {
      const { data, error } = await supabase
        .from("therapist_profiles")
        .select("*")
        .eq("is_available", true)
        .order("created_at", { ascending: false });

      if (!error && data) setTherapists(data);
      setLoading(false);
    };
    fetchTherapists();
  }, []);

  const filtered = therapists.filter((t) => {
    const matchesPop = selected === "All" || t.populations?.includes(selected);
    const matchesSearch =
      t.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      t.specialties?.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesProBono = !proBonoOnly || t.is_pro_bono;
    return matchesPop && matchesSearch && matchesProBono;
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f0f7ff] via-[#f7f0ff] to-[#f0fff7]">
      <nav className="flex items-center justify-between px-8 py-5 bg-white/80 backdrop-blur-sm shadow-sm">
        <Link href="/" className="text-2xl font-bold text-[#4A90D9]">
          Mind<span className="text-[#7B5EA7]">Bridge</span>
        </Link>
        <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-[#4A90D9] transition">
          ← Dashboard
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Find a Therapist</h1>
        <p className="text-gray-500 mb-8">Browse verified specialists across multiple categories</p>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Search by name or speciality..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9]"
          />
          <div className="flex items-center gap-3 flex-wrap">
            {populations.map((p) => (
              <button
                key={p}
                onClick={() => setSelected(p)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition ${
                  selected === p
                    ? "bg-[#4A90D9] text-white border-[#4A90D9]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#4A90D9]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={proBonoOnly}
              onChange={(e) => setProBonoOnly(e.target.checked)}
              className="accent-[#4A90D9]"
            />
            Show Pro Bono (Free) therapists only
          </label>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="flex gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                  </div>
                </div>
                <div className="h-3 bg-gray-100 rounded mb-2" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-500 text-lg font-medium">No therapists found</p>
            {therapists.length === 0 ? (
              <div className="mt-4">
                <p className="text-gray-400 text-sm mb-4">No therapists have registered yet.</p>
                <Link
                  href="/therapist-onboarding"
                  className="inline-block bg-[#4A90D9] text-white font-semibold px-6 py-2 rounded-full text-sm hover:bg-[#357ABD] transition"
                >
                  Are you a therapist? Join us →
                </Link>
              </div>
            ) : (
              <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-4">{filtered.length} therapist{filtered.length !== 1 ? "s" : ""} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((t) => (
                <div key={t.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4A90D9] to-[#7B5EA7] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {t.full_name?.charAt(0) || "T"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{t.full_name}</h3>
                      <p className="text-xs text-gray-400">{t.education}</p>
                    </div>
                  </div>

                  {t.is_verified && (
                    <span className="text-xs bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full mb-3 inline-block">
                      ✓ Verified
                    </span>
                  )}

                  <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{t.bio}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {t.specialties?.slice(0, 3).map((s) => (
                      <span key={s} className="text-xs bg-[#f0f7ff] text-[#4A90D9] px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                    {t.specialties?.length > 3 && (
                      <span className="text-xs text-gray-400">+{t.specialties.length - 3} more</span>
                    )}
                  </div>

                  <div className="text-xs text-gray-400 mb-1">🌐 {t.languages?.join(", ")}</div>
                  {t.location && <div className="text-xs text-gray-400 mb-1">📍 {t.location}</div>}
                  {t.years_experience && <div className="text-xs text-gray-400 mb-3">⏳ {t.years_experience} years experience</div>}

                  <div className="flex items-center justify-between mt-4">
                    <div>
                      {t.is_pro_bono ? (
                        <span className="text-green-600 font-semibold text-sm">Free (Pro Bono)</span>
                      ) : (
                        <span className="text-gray-700 font-semibold text-sm">₹{t.session_fee}/session</span>
                      )}
                    </div>
                    <Link
                      href={`/booking?therapist_id=${t.id}&name=${encodeURIComponent(t.full_name)}&fee=${t.session_fee}&pro_bono=${t.is_pro_bono}`}
                      className="bg-[#4A90D9] text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#357ABD] transition"
                    >
                      Book Session
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* CTA for therapists */}
        <div className="mt-12 text-center bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <p className="text-gray-600 font-medium mb-2">Are you a mental health professional?</p>
          <p className="text-gray-400 text-sm mb-4">Join MindBridge and connect with people who need your support</p>
          <Link
            href="/therapist-onboarding"
            className="inline-block bg-[#C084A0] text-white font-semibold px-6 py-2 rounded-full text-sm hover:bg-[#a8607f] transition"
          >
            Join as a Therapist →
          </Link>
        </div>
      </div>

      <SOSModal />
    </main>
  );
}