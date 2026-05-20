"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import SOSModal from "@/components/shared/SOSModal";

const steps = [
  { id: 1, title: "Your situation", emoji: "🌱" },
  { id: 2, title: "What you need", emoji: "💬" },
  { id: 3, title: "Your match", emoji: "💚" },
];

const proBonoTherapists = [
  {
    id: 1,
    name: "Ms. Priya Nair",
    title: "Therapist",
    specialties: ["Grief", "Trauma", "Women's issues"],
    languages: ["English", "Malayalam", "Tamil"],
    slots: "2 slots available this week",
    avatar: "👩‍⚕️",
    color: "bg-rose-50 border-rose-100",
  },
  {
    id: 2,
    name: "Ms. Fatima Sheikh",
    title: "Counsellor",
    specialties: ["Anxiety", "Relationships", "Burnout"],
    languages: ["English", "Hindi", "Urdu"],
    slots: "3 slots available this week",
    avatar: "👩‍⚕️",
    color: "bg-purple-50 border-purple-100",
  },
  {
    id: 3,
    name: "Mr. Arjun Bose",
    title: "Mental Health Counsellor",
    specialties: ["Depression", "Students", "Career stress"],
    languages: ["English", "Bengali", "Hindi"],
    slots: "1 slot available this week",
    avatar: "👨‍⚕️",
    color: "bg-blue-50 border-blue-100",
  },
];

export default function ProBono() {
  const [step, setStep] = useState(0);
  const [income, setIncome] = useState("");
  const [concern, setConcern] = useState("");
  const [language, setLanguage] = useState("");
  const [matched, setMatched] = useState(false);
  const [booked, setBooked] = useState<number | null>(null);

  const canProceedStep1 = income !== "";
  const canProceedStep2 = concern !== "" && language !== "";

  return (
    <main className="min-h-screen bg-[#fdf6f0]">
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between px-8 py-5 bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-40"
      >
        <Link href="/" className="text-2xl font-bold text-[#4A90D9]">
          Mind<span className="text-[#C084A0]">Bridge</span>
        </Link>
        <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-[#4A90D9] transition">
          Back to Dashboard
        </Link>
      </motion.nav>

      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Header */}
        {!matched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="text-5xl mb-4">💚</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Pro Bono Therapy</h1>
            <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
              Everyone deserves mental health support — regardless of income. Our pro bono therapists offer free sessions to those who need it most.
            </p>
          </motion.div>
        )}

        {/* Step indicators */}
        {!matched && (
          <div className="flex items-center justify-center gap-4 mb-10">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
                  step >= i ? "bg-[#C084A0] text-white" : "bg-gray-100 text-gray-400"
                }`}>
                  {step > i ? "✓" : s.emoji}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step >= i ? "text-gray-700" : "text-gray-300"}`}>
                  {s.title}
                </span>
                {i < steps.length - 1 && (
                  <div className={`w-8 h-0.5 ml-1 ${step > i ? "bg-[#C084A0]" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* Step 1 — Your situation */}
          {step === 0 && !matched && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Tell us about your situation</h2>
                <p className="text-gray-400 text-sm mb-6">This helps us match you with the right therapist. All information is private.</p>

                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    What is your approximate monthly household income?
                  </label>
                  <div className="flex flex-col gap-2">
                    {[
                      "Below ₹10,000",
                      "₹10,000 — ₹25,000",
                      "₹25,000 — ₹50,000",
                      "I am a student with no income",
                      "I am unemployed currently",
                    ].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setIncome(opt)}
                        className={`text-sm py-3 px-4 rounded-xl border text-left transition ${
                          income === opt
                            ? "bg-[#C084A0] text-white border-[#C084A0]"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#C084A0]"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setStep(1)}
                  disabled={!canProceedStep1}
                  className="w-full bg-[#C084A0] text-white font-semibold py-3 rounded-xl hover:bg-[#a8607f] transition disabled:opacity-40"
                >
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2 — What you need */}
          {step === 1 && !matched && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-2">What would you like support with?</h2>
                <p className="text-gray-400 text-sm mb-6">Select what feels most relevant to you right now.</p>

                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-3 block">Primary concern</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Anxiety", "Depression", "Grief", "Trauma", "Relationships", "Burnout", "Self esteem", "Other"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setConcern(opt)}
                        className={`text-sm py-3 px-4 rounded-xl border text-center transition ${
                          concern === opt
                            ? "bg-[#C084A0] text-white border-[#C084A0]"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#C084A0]"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-3 block">Preferred language</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["English", "Hindi", "Bengali", "Tamil", "Telugu", "Marathi"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setLanguage(opt)}
                        className={`text-sm py-2.5 px-3 rounded-xl border text-center transition ${
                          language === opt
                            ? "bg-[#4A90D9] text-white border-[#4A90D9]"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#4A90D9]"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(0)}
                    className="flex-1 bg-gray-50 text-gray-600 font-medium py-3 rounded-xl border border-gray-200 hover:bg-gray-100 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => { setStep(2); setMatched(true); }}
                    disabled={!canProceedStep2}
                    className="flex-2 flex-1 bg-[#C084A0] text-white font-semibold py-3 rounded-xl hover:bg-[#a8607f] transition disabled:opacity-40"
                  >
                    Find my match →
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3 — Matched */}
          {matched && !booked && (
            <motion.div
              key="matched"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-8">
                <div className="text-5xl mb-3">🎉</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Your matches are ready</h2>
                <p className="text-gray-500 text-sm">These therapists offer free sessions and match your needs.</p>
              </div>

              <div className="flex flex-col gap-4">
                {proBonoTherapists.map((t, i) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`${t.color} border rounded-2xl p-5`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl">{t.avatar}</span>
                      <div>
                        <h3 className="font-bold text-gray-800">{t.name}</h3>
                        <p className="text-xs text-gray-400">{t.title}</p>
                      </div>
                      <span className="ml-auto text-xs text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">
                        FREE
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {t.specialties.map((s) => (
                        <span key={s} className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-500 border">{s}</span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mb-3">🌐 {t.languages.join(", ")} · 📅 {t.slots}</p>
                    <button
                      onClick={() => setBooked(t.id)}
                      className="w-full bg-[#C084A0] text-white text-sm font-semibold py-3 rounded-xl hover:bg-[#a8607f] transition"
                    >
                      Request free session
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Booked confirmation */}
          {booked && (
            <motion.div
              key="booked"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="text-6xl mb-6">💚</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Request sent!</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                Your therapist will confirm your session within 24 hours. You will receive an email with the details. You took a brave step today.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 text-left">
                <p className="text-sm font-semibold text-green-700 mb-1">What happens next?</p>
                <ul className="text-xs text-green-600 flex flex-col gap-1">
                  <li>✓ Therapist reviews your request</li>
                  <li>✓ You receive a confirmation email</li>
                  <li>✓ Session link or address is shared</li>
                  <li>✓ Your first session is completely free</li>
                </ul>
              </div>
              <Link
                href="/dashboard"
                className="inline-block bg-[#C084A0] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#a8607f] transition"
              >
                Back to Dashboard
              </Link>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <SOSModal />
    </main>
  );
}