"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import SOSModal from "@/components/shared/SOSModal";

const categories = ["All", "Anxiety", "Depression", "Self Care", "Relationships", "Workplace", "LGBTQ+", "Mindfulness", "Awareness"];

const posts = [
  {
    id: 1,
    category: "Anxiety",
    title: "What Anxiety Really Feels Like — And Why It's More Common Than You Think",
    excerpt: "Anxiety isn't just nervousness. For millions of people, it's a constant hum in the background of every single day. Here's what it actually feels like from the inside.",
    author: "Dr. Ananya Sharma",
    role: "Clinical Psychologist",
    time: "5 min read",
    date: "April 20, 2026",
    emoji: "🌊",
    color: "bg-blue-50 border-blue-100",
    tag: "bg-blue-100 text-blue-700",
  },
  {
    id: 2,
    category: "Self Care",
    title: "The Small Things That Actually Help — A Therapist's Guide to Daily Mental Health",
    excerpt: "Grand gestures rarely save us. It's the tiny, consistent acts of self-care that build resilience over time. Here are the ones that actually work.",
    author: "Ms. Priya Nair",
    role: "Therapist",
    time: "4 min read",
    date: "April 18, 2026",
    emoji: "🌿",
    color: "bg-green-50 border-green-100",
    tag: "bg-green-100 text-green-700",
  },
  {
    id: 3,
    category: "Awareness",
    title: "Breaking the Stigma — Why Indians Still Don't Talk About Mental Health",
    excerpt: "In a country of 1.4 billion people, fewer than 1 in 10 who need mental health care ever receive it. Why? And what can we do about it?",
    author: "Dr. Kabir Das",
    role: "Psychiatrist",
    time: "7 min read",
    date: "April 15, 2026",
    emoji: "🧠",
    color: "bg-purple-50 border-purple-100",
    tag: "bg-purple-100 text-purple-700",
  },
  {
    id: 4,
    category: "LGBTQ+",
    title: "Queer and Struggling — Finding Mental Health Support That Actually Understands You",
    excerpt: "Finding a therapist is hard. Finding one who truly understands queer experiences without judgment is even harder. Here's how to navigate it.",
    author: "Dr. Rohan Mehta",
    role: "Queer Affirmative Therapist",
    time: "6 min read",
    date: "April 12, 2026",
    emoji: "🌈",
    color: "bg-rose-50 border-rose-100",
    tag: "bg-rose-100 text-rose-700",
  },
  {
    id: 5,
    category: "Workplace",
    title: "Burnout Is Not a Badge of Honour — Recognising and Recovering from Work Exhaustion",
    excerpt: "We've glamourised overwork for too long. Burnout is real, it's serious, and it's reversible — but only if you catch it in time.",
    author: "Ms. Fatima Sheikh",
    role: "Counsellor",
    time: "5 min read",
    date: "April 10, 2026",
    emoji: "🔋",
    color: "bg-amber-50 border-amber-100",
    tag: "bg-amber-100 text-amber-700",
  },
  {
    id: 6,
    category: "Mindfulness",
    title: "You Don't Have to Meditate for an Hour — The 5 Minute Practices That Actually Work",
    excerpt: "Mindfulness doesn't require a yoga mat, silence, or an hour of free time. Here are five practices you can do anywhere, anytime.",
    author: "Dr. Vikram Rao",
    role: "Mindfulness Therapist",
    time: "3 min read",
    date: "April 8, 2026",
    emoji: "🕊️",
    color: "bg-teal-50 border-teal-100",
    tag: "bg-teal-100 text-teal-700",
  },
];

const awarenessCards = [
  { emoji: "💙", title: "1 in 7 Indians", desc: "experience a mental health condition at some point in their lifetime.", color: "bg-blue-50" },
  { emoji: "🗣️", title: "Only 10%", desc: "of people who need mental health care in India actually receive it.", color: "bg-rose-50" },
  { emoji: "⏰", title: "Average delay", desc: "of 10 years between onset of symptoms and first treatment.", color: "bg-amber-50" },
  { emoji: "💚", title: "Therapy works", desc: "Studies show 80% of people who seek therapy report improvement.", color: "bg-green-50" },
];

export default function Blog() {
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
          ← Dashboard
        </Link>
      </motion.nav>

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="bg-pink-100 text-[#C084A0] text-xs font-semibold px-4 py-1.5 rounded-full tracking-wide">
            Mental Health Awareness 🌸
          </span>
          <h1 className="text-5xl font-bold text-gray-800 mt-4 mb-4">Blog & Awareness</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Honest, compassionate writing about mental health — by professionals who care.
          </p>
        </motion.div>

        {/* Awareness stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
        >
          {awarenessCards.map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className={`${card.color} rounded-2xl p-5 text-center border border-white shadow-sm`}
            >
              <div className="text-3xl mb-2">{card.emoji}</div>
              <div className="font-bold text-gray-800 text-lg mb-1">{card.title}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{card.desc}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Category filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map((c, i) => (
            <motion.button
              key={c}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="text-xs font-medium px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-600 hover:border-[#C084A0] hover:text-[#C084A0] transition"
            >
              {c}
            </motion.button>
          ))}
        </div>

        {/* Blog posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`${post.color} rounded-3xl p-6 border shadow-sm cursor-pointer`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${post.tag}`}>
                  {post.category}
                </span>
                <span className="text-2xl">{post.emoji}</span>
              </div>
              <h3 className="font-bold text-gray-800 text-base leading-snug mb-3">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <div>
                  <p className="text-xs font-semibold text-gray-700">{post.author}</p>
                  <p className="text-xs text-gray-400">{post.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{post.time}</p>
                  <p className="text-xs text-gray-300">{post.date}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Weekly digest signup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 rounded-3xl p-10 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">This Week in Mental Health 📬</h2>
          <p className="text-gray-500 text-sm mb-6">
            A curated weekly digest of articles, tips, and resources. No spam, just care.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C084A0] bg-white"
            />
            <button className="bg-[#C084A0] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#a8607f] transition">
              Subscribe
            </button>
          </div>
        </motion.div>

      </div>

      <SOSModal />
    </main>
  );
}