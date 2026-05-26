"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import SOSModal from "@/components/shared/SOSModal";

const quotes = [
  "There is hope. Even when your brain tells you there isn't.",
  "Your brain isn't broken. It's just wired differently.",
  "You don't have to control your thoughts. You just have to stop letting them control you.",
  "Make your mental health a priority.",
  "Small steps are also progress.",
  "Asking for help is strength.",
  "You are more than enough.",
  "It's okay to have bad and unproductive days.",
  "You deserve love, care and support.",
  "Trust yourself and the journey you are on.",
];

const reminders = [
  { text: "Make time for yourself and take breaks", color: "bg-rose-100 text-rose-700" },
  { text: "It's ok to have bad and unproductive days", color: "bg-amber-100 text-amber-700" },
  { text: "You deserve love, care and support", color: "bg-teal-100 text-teal-700" },
  { text: "Allow yourself to feel your feelings", color: "bg-indigo-100 text-indigo-700" },
  { text: "Listen to your emotions", color: "bg-sky-100 text-sky-700" },
  { text: "The same good you see in others is within you too", color: "bg-pink-100 text-pink-700" },
  { text: "It's ok to just survive some days", color: "bg-purple-100 text-purple-700" },
  { text: "Trust yourself. Things get better.", color: "bg-green-100 text-green-700" },
];

const affirmations = [
  "I won't give up", "I'm dreaming big", "I'm putting myself first",
  "I'm prioritising my health", "I'm mastering self-soothing", "I'm choosing me",
  "I'm trusting the healing process", "I'm listening to my needs", "I'm embracing who I am",
];

const pastelColors = [
  "bg-blue-100", "bg-pink-100", "bg-purple-100", "bg-green-100",
  "bg-yellow-100", "bg-rose-100", "bg-teal-100", "bg-indigo-100", "bg-amber-100",
];

const things = [
  { icon: "🌸", text: "You don't have to be perfect" },
  { icon: "🤝", text: "Asking for help is strength" },
  { icon: "🦋", text: "Having a bad day is ok" },
  { icon: "👣", text: "Small steps are also progress" },
  { icon: "🌅", text: "Tomorrow is a new day" },
  { icon: "💛", text: "Kindness is free" },
  { icon: "❤️", text: "You are loved and worthy" },
  { icon: "💕", text: "People love and appreciate you" },
  { icon: "✨", text: "You are more than enough" },
  { icon: "🎨", text: "Beauty and strength come from within" },
  { icon: "🔄", text: "It's okay to start over and try again" },
  { icon: "🔴", text: "Saying no is okay" },
];

export default function Home() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#fdf6f0] overflow-x-hidden">

      {/* Navbar */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between px-8 py-5 bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-40"
      >
        <Link href="/">
          <img src="/mindbridgelogo.png" alt="MindBridge" className="h-29 w-auto" />
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
          <Link href="/therapists" className="hover:text-[#4A90D9] transition">Find a Therapist</Link>
          <Link href="/quiz" className="hover:text-[#4A90D9] transition">Self Assessment</Link>
          <Link href="/community" className="hover:text-[#4A90D9] transition">Community</Link>
          <Link href="/resources" className="hover:text-[#4A90D9] transition">Resources</Link>
          <Link href="/blog" className="hover:text-[#4A90D9] transition">Blog</Link>
          <Link href="/corporate" className="hover:text-[#7B5EA7] transition">Corporate</Link>
          <Link href="/insurance" className="hover:text-[#4A90D9] transition">Insurance</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-[#4A90D9] transition">Login</Link>
          <Link href="/signup" className="bg-[#C084A0] text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-[#a8607f] transition">
            Get Started
          </Link>
        </div>
      </motion.nav>

      {/* Floating background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-64 h-64 bg-pink-100 rounded-full opacity-40 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-20 w-80 h-80 bg-blue-100 rounded-full opacity-40 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 left-1/3 w-72 h-72 bg-purple-100 rounded-full opacity-30 blur-3xl"
        />
      </div>

      {/* Hero */}
      <section className="relative z-10 flex items-center justify-center text-center px-4 py-20 gap-6">
        {/* Left card */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="hidden lg:flex rounded-3xl overflow-hidden w-80 h-96 shadow-xl flex-shrink-0"
          style={{ rotate: -4 }}
        >
          <img src="/small-guide.jpg" alt="A small guide for big feelings" className="w-full h-full object-cover" />
        </motion.div>

        {/* Center content */}
        <div className="flex flex-col items-center max-w-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <span className="bg-pink-100 text-[#C084A0] text-xs font-semibold px-4 py-1.5 rounded-full tracking-wide">
              Your mental health matters 🌸
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6"
          >
            A safe space for your{" "}
            <span className="text-[#C084A0]">mental wellbeing</span>
          </motion.h1>

          <div className="h-16 flex items-center justify-center mb-8">
            <AnimatePresence mode="wait">
              <motion.p
                key={quoteIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="text-base text-gray-400 italic max-w-sm"
              >
                &ldquo;{quotes[quoteIndex]}&rdquo;
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/therapists" className="bg-[#4A90D9] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#357ABD] transition shadow-md">
              Find a Therapist
            </Link>
            <Link href="/quiz" className="bg-white text-[#C084A0] font-semibold px-8 py-3 rounded-full border border-[#C084A0] hover:bg-pink-50 transition">
              Take Self Assessment
            </Link>
          </motion.div>
        </div>

        {/* Right card */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="hidden lg:flex rounded-3xl overflow-hidden w-80 h-96 shadow-xl flex-shrink-0"
          style={{ rotate: 4 }}
        >
          <img src="/face-flowers.jpg" alt="Wired differently" className="w-full h-full object-cover" />
        </motion.div>
      </section>

      {/* Floating quotes strip */}
      <section className="relative z-10 py-8 overflow-hidden bg-white/50">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex gap-8 whitespace-nowrap"
        >
          {[...quotes, ...quotes].map((q, i) => (
            <span key={i} className="text-sm text-gray-400 italic px-6 border-r border-pink-200">
              &ldquo;{q}&rdquo;
            </span>
          ))}
        </motion.div>
      </section>

      {/* Reminders section */}
      <section className="relative z-10 px-8 py-20 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-3">Reminders for you 🌿</h2>
          <p className="text-gray-400">Things worth remembering on hard days</p>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {reminders.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              viewport={{ once: true }}
              className={`${r.color} rounded-3xl p-5 text-sm font-medium leading-relaxed cursor-default`}
            >
              {r.text}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Affirmations */}
      <section className="relative z-10 py-20 bg-white/60 px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-3">I will be OK because... 🌟</h2>
          <p className="text-gray-400">Click one that resonates with you today</p>
        </motion.div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
          {affirmations.map((a, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              viewport={{ once: true }}
              className={`${pastelColors[i % pastelColors.length]} rounded-2xl p-4 text-xs font-medium text-gray-600 leading-relaxed text-center`}
            >
              {a}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Things to remember */}
      <section className="relative z-10 px-8 py-20 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-3">Things to remember 💛</h2>
          <p className="text-gray-400">On the days you forget your own worth</p>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {things.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center text-center gap-2"
            >
              <span className="text-3xl">{t.icon}</span>
              <p className="text-xs font-medium text-gray-600 leading-relaxed">{t.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-8 py-20 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center text-gray-800 mb-12"
        >
          Everything you need, in one place 💙
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: "🧑‍⚕️", title: "Verified Therapists", desc: "Browse specialists across 15+ categories — LGBTQ+, grief, children, addiction and more.", color: "bg-blue-50" },
            { icon: "🆘", title: "Immediate Support", desc: "Feeling overwhelmed? Get instant chat or call support from trained volunteers, anytime.", color: "bg-rose-50" },
            { icon: "📋", title: "Self Assessment", desc: "Take clinically-backed quizzes for depression, anxiety, ADHD, and burnout.", color: "bg-amber-50" },
            { icon: "💬", title: "Community", desc: "Join moderated peer support groups. You are not alone in what you're going through.", color: "bg-purple-50" },
            { icon: "💚", title: "Pro Bono Therapy", desc: "Can't afford therapy? Access free sessions with pro bono therapists.", color: "bg-green-50" },
            { icon: "🌐", title: "Your Language", desc: "Available in Hindi, Bengali, Tamil, Telugu, Marathi and more.", color: "bg-teal-50" },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`${f.color} rounded-3xl p-6 border border-white shadow-sm`}
            >
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 px-8 py-20 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-3">How it works 🌱</h2>
          <p className="text-gray-400">Three simple steps to start feeling better</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { step: "01", icon: "🔍", title: "Find your support", desc: "Browse therapists, take a self-assessment quiz, or explore our resources to understand what you need." },
            { step: "02", icon: "📅", title: "Book a session", desc: "Choose a therapist that fits your budget, language, and availability. Pro bono options available." },
            { step: "03", icon: "🌸", title: "Start healing", desc: "Attend your session, journal your thoughts, and connect with a community that understands you." },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center gap-3"
            >
              <span className="text-xs font-bold text-[#C084A0] tracking-widest">{s.step}</span>
              <span className="text-4xl">{s.icon}</span>
              <h3 className="font-semibold text-gray-800 text-lg">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 px-8 py-20 bg-white/60">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-3">What people say 💬</h2>
          <p className="text-gray-400">Real stories from people on their healing journey</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { name: "Ananya, 24", text: "MindBridge helped me find a therapist who speaks Bengali and understands my culture. I finally feel heard.", emoji: "🌸" },
            { name: "Rohan, 31", text: "The pro bono program changed my life. I couldn't afford therapy before, and now I go every week.", emoji: "💙" },
            { name: "Priya, 19", text: "The community posts made me realise I'm not alone. The quiz helped me understand my anxiety better.", emoji: "🌿" },
          ].map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
            >
              <p className="text-gray-600 text-sm leading-relaxed italic mb-4">{t.emoji} &ldquo;{t.text}&rdquo;</p>
              <p className="text-xs font-semibold text-[#4A90D9]">— {t.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Live counter */}
      <section className="relative z-10 px-8 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#4A90D9] to-[#7B5EA7] rounded-3xl p-12 max-w-2xl mx-auto text-white"
        >
          <p className="text-6xl font-bold mb-2">2,847</p>
          <p className="text-xl font-medium opacity-90">people supported this month 💙</p>
          <p className="text-sm opacity-70 mt-2">Join them on their journey to better mental health</p>
          <Link href="/signup" className="inline-block mt-6 bg-white text-[#4A90D9] font-semibold px-8 py-3 rounded-full hover:bg-pink-50 transition">
            Join MindBridge
          </Link>
        </motion.div>
      </section>

      {/* Awareness calendar */}
      <section className="relative z-10 px-8 py-20 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-3">Awareness calendar 📅</h2>
          <p className="text-gray-400">Important mental health dates to remember</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { date: "Jan 17", event: "World Religion Day", color: "bg-amber-50 border-amber-200", emoji: "🕊️" },
            { date: "Feb 13", event: "World Radio Day — Mental Health Stories", color: "bg-blue-50 border-blue-200", emoji: "📻" },
            { date: "Mar 1", event: "Self-Injury Awareness Day", color: "bg-rose-50 border-rose-200", emoji: "🎗️" },
            { date: "Apr 7", event: "World Health Day", color: "bg-green-50 border-green-200", emoji: "💚" },
            { date: "May 18", event: "Mental Health Awareness Month", color: "bg-purple-50 border-purple-200", emoji: "🧠" },
            { date: "Oct 10", event: "World Mental Health Day", color: "bg-pink-50 border-pink-200", emoji: "🌸" },
          ].map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              viewport={{ once: true }}
              className={`${c.color} border rounded-2xl p-4 flex items-center gap-4`}
            >
              <span className="text-3xl">{c.emoji}</span>
              <div>
                <p className="text-xs font-bold text-gray-500 tracking-wide">{c.date}</p>
                <p className="text-sm font-semibold text-gray-700">{c.event}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final quote */}
      <section className="relative z-10 py-20 text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 rounded-3xl p-12 max-w-3xl mx-auto"
        >
          <p className="text-2xl font-bold text-gray-700 leading-relaxed mb-4 italic">
            &ldquo;Like flowers that grow through concrete, your healing begins the moment you reach for the light.&rdquo; 🌸
          </p>
          <Link href="/signup" className="inline-block bg-[#C084A0] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#a8607f] transition mt-4">
            Start your journey
          </Link>
        </motion.div>
      </section>

      <SOSModal />
    </main>
  );
}