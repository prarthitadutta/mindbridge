"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import SOSModal from "@/components/shared/SOSModal";

const feelings = [
  {
    name: "Anxious",
    emoji: "😰",
    color: "bg-yellow-100 border-yellow-300 text-yellow-800",
    dot: "bg-yellow-400",
    description: "Anxiety is your mind trying to protect you from a perceived threat. It's uncomfortable, but it makes sense.",
    whatItMeans: "You might be worried about something uncertain, feeling out of control, or anticipating something difficult.",
    nextSteps: [
      { emoji: "🌊", text: "Try box breathing — inhale 4s, hold 4s, exhale 4s" },
      { emoji: "📝", text: "Write down exactly what you're worried about" },
      { emoji: "🚶", text: "Take a short walk to regulate your nervous system" },
      { emoji: "💬", text: "Talk to someone you trust about what's on your mind" },
    ],
  },
  {
    name: "Sad",
    emoji: "😔",
    color: "bg-blue-100 border-blue-300 text-blue-800",
    dot: "bg-blue-400",
    description: "Sadness is a natural response to loss, disappointment, or feeling disconnected. It deserves to be felt, not pushed away.",
    whatItMeans: "Something or someone matters to you deeply. Sadness is proof of that connection.",
    nextSteps: [
      { emoji: "🫂", text: "Let yourself cry — it genuinely helps release emotion" },
      { emoji: "🎵", text: "Listen to music that matches or gently lifts your mood" },
      { emoji: "📓", text: "Journal what you're feeling without judgment" },
      { emoji: "🌿", text: "Be gentle with yourself today — rest is okay" },
    ],
  },
  {
    name: "Angry",
    emoji: "😤",
    color: "bg-red-100 border-red-300 text-red-800",
    dot: "bg-red-400",
    description: "Anger usually points to something important — a boundary crossed, an injustice felt, or a need unmet.",
    whatItMeans: "Something has felt unfair, dismissive, or threatening to you. Your anger is trying to tell you something.",
    nextSteps: [
      { emoji: "💨", text: "Take deep, slow breaths before responding to anything" },
      { emoji: "🏃", text: "Move your body — run, stretch, or do something physical" },
      { emoji: "✍️", text: "Write an unsent letter to whoever or whatever upset you" },
      { emoji: "🧩", text: "Identify what need is being unmet underneath the anger" },
    ],
  },
  {
    name: "Overwhelmed",
    emoji: "😵",
    color: "bg-purple-100 border-purple-300 text-purple-800",
    dot: "bg-purple-400",
    description: "Overwhelm happens when demands exceed your current capacity. It's not weakness — it's a signal to slow down.",
    whatItMeans: "You're carrying too much. Something needs to be put down, postponed, or shared with someone else.",
    nextSteps: [
      { emoji: "📋", text: "Write everything down — get it out of your head" },
      { emoji: "🎯", text: "Pick just ONE thing to focus on right now" },
      { emoji: "🙋", text: "Ask for help — you don't have to do it all alone" },
      { emoji: "⏸️", text: "Take a 10 minute break before doing anything else" },
    ],
  },
  {
    name: "Lonely",
    emoji: "🥺",
    color: "bg-indigo-100 border-indigo-300 text-indigo-800",
    dot: "bg-indigo-400",
    description: "Loneliness is one of the most painful human experiences. It doesn't mean you're unloved — it means you're longing for connection.",
    whatItMeans: "You need genuine connection — to be seen, heard, and felt by another person.",
    nextSteps: [
      { emoji: "📞", text: "Reach out to someone — even a short message helps" },
      { emoji: "🏡", text: "Go somewhere with people, even if you don't talk to anyone" },
      { emoji: "💬", text: "Join our community — others here understand" },
      { emoji: "🧑‍⚕️", text: "Consider speaking with a therapist about this feeling" },
    ],
  },
  {
    name: "Numb",
    emoji: "😶",
    color: "bg-gray-100 border-gray-300 text-gray-700",
    dot: "bg-gray-400",
    description: "Numbness is often your mind's way of protecting you from feelings that feel too big to handle right now.",
    whatItMeans: "You may have been through a lot. Your system is taking a break from feeling as a form of self-protection.",
    nextSteps: [
      { emoji: "🌊", text: "Try something sensory — cold water, a warm drink, a texture" },
      { emoji: "🎵", text: "Listen to music you used to love" },
      { emoji: "🌿", text: "Spend time in nature — even sitting outside helps" },
      { emoji: "🧑‍⚕️", text: "Talk to a professional — numbness deserves attention" },
    ],
  },
  {
    name: "Grateful",
    emoji: "🥰",
    color: "bg-pink-100 border-pink-300 text-pink-800",
    dot: "bg-pink-400",
    description: "Gratitude is a powerful emotion that expands our sense of connection and meaning. Hold onto this feeling.",
    whatItMeans: "Something or someone has touched you. You're aware of goodness in your life right now.",
    nextSteps: [
      { emoji: "📓", text: "Write down three things you're grateful for today" },
      { emoji: "💌", text: "Tell someone what they mean to you" },
      { emoji: "🌸", text: "Savour this moment — let it fully land" },
      { emoji: "🤝", text: "Share your energy with someone who might need it" },
    ],
  },
  {
    name: "Hopeful",
    emoji: "🌱",
    color: "bg-green-100 border-green-300 text-green-800",
    dot: "bg-green-400",
    description: "Hope is a quiet, powerful force. It means part of you believes things can get better — and that matters enormously.",
    whatItMeans: "You're looking forward. Something feels possible. That's worth nurturing.",
    nextSteps: [
      { emoji: "🎯", text: "Set one small intention for today" },
      { emoji: "📓", text: "Write about what you're hoping for" },
      { emoji: "🌿", text: "Do something that moves you toward what you hope for" },
      { emoji: "💬", text: "Share your hope with someone who needs to hear it" },
    ],
  },
  {
    name: "Confused",
    emoji: "😕",
    color: "bg-amber-100 border-amber-300 text-amber-800",
    dot: "bg-amber-400",
    description: "Confusion often comes before clarity. Not knowing is uncomfortable, but it's also part of growing.",
    whatItMeans: "You're in a transition or facing something complex. Your mind is working to make sense of it.",
    nextSteps: [
      { emoji: "📝", text: "Write out everything you're confused about" },
      { emoji: "💬", text: "Talk it through with someone you trust" },
      { emoji: "⏳", text: "Give yourself permission to not have answers right now" },
      { emoji: "🧑‍⚕️", text: "A therapist can help you find clarity" },
    ],
  },
  {
    name: "Burnt out",
    emoji: "🔋",
    color: "bg-orange-100 border-orange-300 text-orange-800",
    dot: "bg-orange-400",
    description: "Burnout is what happens when you give more than you can sustain for too long. It's serious and it's real.",
    whatItMeans: "Your body and mind are depleted. This is not laziness — this is exhaustion at a deep level.",
    nextSteps: [
      { emoji: "🛏️", text: "Rest without guilt — your body needs it" },
      { emoji: "🚫", text: "Say no to at least one thing today" },
      { emoji: "🌿", text: "Do something that fills you up, not drains you" },
      { emoji: "🧑‍⚕️", text: "Speak to a professional about sustainable boundaries" },
    ],
  },
];

export default function Feelings() {
  const [selected, setSelected] = useState<typeof feelings[0] | null>(null);

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

      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="text-5xl mb-4">🎨</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Name your feelings</h1>
          <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
            Sometimes just naming what you feel is the first step to understanding it. Pick what resonates with you right now.
          </p>
        </motion.div>

        {/* Feeling cards */}
        {!selected && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {feelings.map((f, i) => (
              <motion.button
                key={f.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                onClick={() => setSelected(f)}
                className={`${f.color} border-2 rounded-2xl p-4 text-center flex flex-col items-center gap-2 shadow-sm`}
              >
                <span className="text-4xl">{f.emoji}</span>
                <span className="text-sm font-semibold">{f.name}</span>
              </motion.button>
            ))}
          </div>
        )}

        {/* Selected feeling detail */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="text-7xl mb-4"
                >
                  {selected.emoji}
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">You are feeling {selected.name.toLowerCase()}</h2>
                <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
                  {selected.description}
                </p>
              </div>

              <div className={`${selected.color} border-2 rounded-3xl p-6 mb-6`}>
                <h3 className="font-bold text-gray-800 mb-2">What this might mean</h3>
                <p className="text-sm leading-relaxed">{selected.whatItMeans}</p>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
                <h3 className="font-bold text-gray-800 mb-4">What you can do right now</h3>
                <div className="flex flex-col gap-3">
                  {selected.nextSteps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <span className="text-xl">{step.emoji}</span>
                      <p className="text-sm text-gray-600 leading-relaxed">{step.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelected(null)}
                  className="flex-1 bg-white border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition text-sm"
                >
                  Choose a different feeling
                </button>
                <Link
                  href="/therapists"
                  className="flex-1 bg-[#C084A0] text-white font-semibold py-3 rounded-xl hover:bg-[#a8607f] transition text-sm text-center"
                >
                  Talk to a therapist
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SOSModal />
    </main>
  );
}