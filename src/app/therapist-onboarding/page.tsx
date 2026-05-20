"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

const specialtyOptions = [
  "Anxiety", "Depression", "Trauma & PTSD", "Relationships",
  "Grief & Loss", "LGBTQ+", "Children & Adolescents", "Addiction",
  "OCD", "Eating Disorders", "Stress Management", "Career & Work",
  "Family Therapy", "Burnout", "ADHD", "Sleep Issues",
];

const languageOptions = [
  "English", "Hindi", "Bengali", "Tamil", "Telugu",
  "Marathi", "Gujarati", "Kannada", "Malayalam", "Punjabi",
];

const populationOptions = [
  "Adults", "Teenagers", "Children", "Elderly", "Couples", "Families",
];

export default function TherapistOnboarding() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    bio: "",
    education: "",
    location: "",
    years_experience: "",
    session_fee: "",
    is_pro_bono: false,
    specialties: [] as string[],
    languages: [] as string[],
    populations: [] as string[],
  });

  const toggle = (field: "specialties" | "languages" | "populations", value: string) => {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(value)
        ? f[field].filter((v) => v !== value)
        : [...f[field], value],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please log in first");
      router.push("/login");
      return;
    }

    // Update profile role to therapist
    await supabase
      .from("profiles")
      .update({ role: "therapist" })
      .eq("id", user.id);

    // Insert therapist profile
    const { error } = await supabase
      .from("therapist_profiles")
      .upsert({
        user_id: user.id,
        full_name: form.full_name,
        bio: form.bio,
        education: form.education,
        location: form.location,
        years_experience: parseInt(form.years_experience),
        session_fee: parseInt(form.session_fee),
        is_pro_bono: form.is_pro_bono,
        specialties: form.specialties,
        languages: form.languages,
        populations: form.populations,
        is_verified: false,
        is_available: true,
      });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success("Profile submitted! We'll verify you shortly 🌸");
      router.push("/dashboard");
    }
  };

  const chip = (
    label: string,
    selected: boolean,
    onClick: () => void,
    color = "bg-blue-100 text-blue-700 border-blue-200"
  ) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
        selected ? color : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f0f7ff] via-[#f7f0ff] to-[#f0fff7] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-[#4A90D9]">
            Mind<span className="text-[#C084A0]">Bridge</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">Join as a Therapist</h1>
          <p className="text-gray-500 text-sm mt-1">Help people find the support they need</p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-all ${
                s <= step ? "bg-[#4A90D9]" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-8">

          {/* Step 1 — Basic Info */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-lg font-semibold text-gray-800">Basic Information</h2>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name *</label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  placeholder="Dr. Priya Sharma"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Bio *</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Tell clients about yourself, your approach, and what you specialise in..."
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9] resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Education & Qualifications *</label>
                <input
                  type="text"
                  value={form.education}
                  onChange={(e) => setForm({ ...form, education: e.target.value })}
                  placeholder="M.Phil Clinical Psychology, NIMHANS"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Mumbai, Maharashtra"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Years of Experience</label>
                  <input
                    type="number"
                    value={form.years_experience}
                    onChange={(e) => setForm({ ...form, years_experience: e.target.value })}
                    placeholder="5"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9]"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  if (!form.full_name || !form.bio || !form.education) {
                    toast.error("Please fill in all required fields");
                    return;
                  }
                  setStep(2);
                }}
                className="bg-[#4A90D9] text-white font-semibold py-3 rounded-xl hover:bg-[#357ABD] transition mt-2"
              >
                Next →
              </button>
            </div>
          )}

          {/* Step 2 — Specialties & Languages */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-lg font-semibold text-gray-800">Specialties & Languages</h2>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Areas of Speciality * <span className="text-gray-400">(select all that apply)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {specialtyOptions.map((s) =>
                    chip(s, form.specialties.includes(s), () => toggle("specialties", s), "bg-blue-100 text-blue-700 border-blue-200")
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">Languages *</label>
                <div className="flex flex-wrap gap-2">
                  {languageOptions.map((l) =>
                    chip(l, form.languages.includes(l), () => toggle("languages", l), "bg-purple-100 text-purple-700 border-purple-200")
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">Populations Served *</label>
                <div className="flex flex-wrap gap-2">
                  {populationOptions.map((p) =>
                    chip(p, form.populations.includes(p), () => toggle("populations", p), "bg-green-100 text-green-700 border-green-200")
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={() => {
                    if (form.specialties.length === 0 || form.languages.length === 0) {
                      toast.error("Please select at least one specialty and language");
                      return;
                    }
                    setStep(3);
                  }}
                  className="flex-1 bg-[#4A90D9] text-white font-semibold py-3 rounded-xl hover:bg-[#357ABD] transition"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Fees */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-lg font-semibold text-gray-800">Session Fees</h2>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Session Fee (₹ per session)
                </label>
                <input
                  type="number"
                  value={form.session_fee}
                  onChange={(e) => setForm({ ...form, session_fee: e.target.value })}
                  placeholder="1500"
                  disabled={form.is_pro_bono}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9] disabled:opacity-50 disabled:bg-gray-50"
                />
              </div>

              <div
                onClick={() => setForm({ ...form, is_pro_bono: !form.is_pro_bono, session_fee: !form.is_pro_bono ? "0" : "" })}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${
                  form.is_pro_bono ? "border-green-400 bg-green-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  form.is_pro_bono ? "border-green-500 bg-green-500" : "border-gray-300"
                }`}>
                  {form.is_pro_bono && <span className="text-white text-xs">✓</span>}
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">Offer Pro Bono Sessions</p>
                  <p className="text-xs text-gray-500">Provide free sessions to those who cannot afford therapy</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-700">
                🔍 Your profile will be reviewed by our team before going live. This usually takes 1-2 business days.
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-[#C084A0] text-white font-semibold py-3 rounded-xl hover:bg-[#a8607f] transition disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Submit Profile 🌸"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}