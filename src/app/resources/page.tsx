"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import SOSModal from "@/components/shared/SOSModal";

const resources = [
  {
    id: 1,
    name: "iCall",
    type: "govt",
    category: "Crisis Support",
    city: "Pan India",
    online: true,
    phone: "9152987821",
    desc: "Free psychological counselling and mental health support by TISS trained counsellors.",
    languages: ["English", "Hindi"],
    fee: "Free",
    emoji: "📞",
    color: "bg-blue-50 border-blue-100",
  },
  {
    id: 2,
    name: "Vandrevala Foundation",
    type: "ngo",
    category: "Crisis Helpline",
    city: "Pan India",
    online: true,
    phone: "1860-2662-345",
    desc: "24/7 mental health helpline offering free support for emotional distress and crisis situations.",
    languages: ["English", "Hindi"],
    fee: "Free",
    emoji: "💙",
    color: "bg-purple-50 border-purple-100",
  },
  {
    id: 3,
    name: "Fortis Stress Helpline",
    type: "private",
    category: "Crisis Support",
    city: "Pan India",
    online: true,
    phone: "8376804102",
    desc: "Mental health support helpline by Fortis Healthcare for stress, anxiety and emotional distress.",
    languages: ["English", "Hindi"],
    fee: "Free",
    emoji: "🏥",
    color: "bg-green-50 border-green-100",
  },
  {
    id: 4,
    name: "NIMHANS",
    type: "govt",
    category: "Psychiatric Care",
    city: "Bangalore",
    online: false,
    phone: "080-46110007",
    desc: "National Institute of Mental Health and Neurosciences — India's premier mental health institution.",
    languages: ["English", "Kannada", "Hindi"],
    fee: "Subsidised",
    emoji: "🏛️",
    color: "bg-amber-50 border-amber-100",
  },
  {
    id: 5,
    name: "Sangath",
    type: "ngo",
    category: "Community Mental Health",
    city: "Goa / Online",
    online: true,
    phone: "Contact via website",
    desc: "NGO providing affordable mental health care through community health workers across India.",
    languages: ["English", "Hindi", "Konkani"],
    fee: "Low cost",
    emoji: "🌱",
    color: "bg-teal-50 border-teal-100",
  },
  {
    id: 6,
    name: "The MINDS Foundation",
    type: "ngo",
    category: "Rural Mental Health",
    city: "Gujarat / Online",
    online: true,
    phone: "Contact via website",
    desc: "Focused on destigmatising mental health in rural India through education and community support.",
    languages: ["English", "Hindi", "Gujarati"],
    fee: "Free",
    emoji: "🌾",
    color: "bg-rose-50 border-rose-100",
  },
  {
    id: 7,
    name: "Manas Foundation",
    type: "ngo",
    category: "Therapy and Counselling",
    city: "Delhi",
    online: true,
    phone: "011-41011253",
    desc: "Mental health NGO offering affordable therapy, support groups and awareness programmes.",
    languages: ["English", "Hindi"],
    fee: "Sliding scale",
    emoji: "🧠",
    color: "bg-indigo-50 border-indigo-100",
  },
  {
    id: 8,
    name: "Parivarthan",
    type: "ngo",
    category: "Counselling",
    city: "Bangalore",
    online: true,
    phone: "7676602602",
    desc: "Counselling and training centre offering affordable therapy and professional development.",
    languages: ["English", "Kannada"],
    fee: "Low cost",
    emoji: "🌟",
    color: "bg-yellow-50 border-yellow-100",
  },
];

const feelBetter = [
  { emoji: "🚶", title: "Go for a walk", desc: "Even 10 minutes outside can shift your mood significantly.", color: "bg-green-50" },
  { emoji: "📓", title: "Journal your thoughts", desc: "Write without judgment. Get it out of your head and onto paper.", color: "bg-amber-50" },
  { emoji: "🎵", title: "Listen to music", desc: "Create a playlist for different moods — calm, energised, comforted.", color: "bg-purple-50" },
  { emoji: "🌊", title: "Box breathing", desc: "Inhale 4s, hold 4s, exhale 4s, hold 4s. Repeat 4 times.", color: "bg-blue-50" },
  { emoji: "📞", title: "Call someone you trust", desc: "Connection is medicine. You don't have to explain everything.", color: "bg-rose-50" },
  { emoji: "🫖", title: "Make a warm drink", desc: "Slow down. Sit with it. Let your body feel held.", color: "bg-orange-50" },
];

export default function Resources() {
  const [typeFilter, setTypeFilter] = useState("All");
  const [onlineFilter, setOnlineFilter] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = resources.filter((r) => {
    const matchType = typeFilter === "All" || r.type === typeFilter.toLowerCase();
    const matchOnline = !onlineFilter || r.online;
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase()) ||
      r.city.toLowerCase().includes(search.toLowerCase());
    return matchType && matchOnline && matchSearch;
  });

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

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="bg-teal-100 text-teal-700 text-xs font-semibold px-4 py-1.5 rounded-full tracking-wide">
            Help is closer than you think 🌿
          </span>
          <h1 className="text-5xl font-bold text-gray-800 mt-4 mb-4">Mental Health Resources</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Government, private and NGO resources across India — filtered for what you need right now.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl p-5 shadow-sm mb-8 flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Search by name, category or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9]"
          />
          <div className="flex items-center gap-3 flex-wrap">
            {["All", "Govt", "Private", "NGO"].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`text-xs font-medium px-4 py-2 rounded-full border transition ${
                  typeFilter === t
                    ? "bg-[#4A90D9] text-white border-[#4A90D9]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#4A90D9]"
                }`}
              >
                {t}
              </button>
            ))}
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer ml-2">
              <input
                type="checkbox"
                checked={onlineFilter}
                onChange={(e) => setOnlineFilter(e.target.checked)}
                className="accent-[#4A90D9]"
              />
              Online / Remote only
            </label>
          </div>
        </motion.div>

        <p className="text-sm text-gray-400 mb-4">{filtered.length} resources found</p>

        {/* Resources grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          {filtered.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className={`${r.color} border rounded-2xl p-5 shadow-sm`}
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">{r.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-800">{r.name}</h3>
                    <span className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-400 border">{r.type}</span>
                    {r.online && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Online</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{r.category} · {r.city}</p>
                </div>
                <span className="text-xs font-semibold text-[#4A90D9] bg-white px-2 py-1 rounded-lg border border-blue-100">
                  {r.fee}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">{r.desc}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1 flex-wrap">
                  {r.languages.map((l) => (
                    <span key={l} className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-400 border">{l}</span>
                  ))}
                </div>
                <span className="text-xs font-semibold text-[#4A90D9]">
                  📞 {r.phone}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feel better section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">What can I do right now to feel better? 💛</h2>
          <p className="text-gray-400 text-center mb-8 text-sm">Simple things that actually help</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {feelBetter.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                viewport={{ once: true }}
                className={`${f.color} rounded-2xl p-5 text-center`}
              >
                <div className="text-3xl mb-2">{f.emoji}</div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>

      <SOSModal />
    </main>
  );
}