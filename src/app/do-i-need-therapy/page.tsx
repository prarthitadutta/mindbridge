"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import SOSModal from "@/components/shared/SOSModal";

const questions = [
  {
    id: 1,
    question: "How often do you feel overwhelmed by your emotions?",
    emoji: "🌊",
    options: [
      { text: "Rarely or never", score: 0 },
      { text: "Sometimes, but I manage", score: 1 },
      { text: "Often — it's hard to cope", score: 2 },
      { text: "Almost every day", score: 3 },
    ],
  },
  {
    id: 2,
    question: "Have your feelings been affecting your work, relationships or daily life?",
    emoji: "💼",
    options: [
      { text: "Not at all", score: 0 },
      { text: "A little bit", score: 1 },
      { text: "Quite a bit", score: 2 },
      { text: "Significantly", score: 3 },
    ],
  },
  {
    id: 3,
    question: "Do you find yourself thinking the same difficult thoughts repeatedly?",
    emoji: "🔁",
    options: [
      { text: "No, not really", score: 0 },
      { text: "Occasionally", score: 1 },
      { text: "Yes, fairly often", score: 2 },
      { text: "Yes, it feels constant", score: 3 },
    ],
  },
  {
    id: 4,
    question: "Have you experienced anything in your past that still affects you today?",
    emoji: "🕰️",
    options: [
      { text: "No, I feel at peace with my past", score: 0 },
      { text: "There are things, but they don't bother me much", score: 1 },
      { text: "Yes, some things still affect me", score: 2 },
      { text: "Yes, significantly", score: 3 },
    ],
  },
  {
    id: 5,
    question: "Do you have someone in your life you can openly talk to about how you feel?",
    emoji: "💬",
    options: [
      { text: "Yes, I have strong support", score: 0 },
      { text: "Sort of — but not fully", score: 1 },
      { text: "Not really", score: 2 },
      { text: "No, I feel quite alone in this", score: 3 },
    ],
  },
  {
    id: 6,
    question: "How would you describe your relationship with yourself?",
    emoji: "🪞",
    options: [
      { text: "Generally positive", score: 0 },
      { text: "It has its ups and downs", score: 1 },
      { text: "I'm quite hard on myself", score: 2 },
      { text: "I struggle to like or accept myself", score: 3 },
    ],
  },
  {
    id: 7,
    question: "Have you ever felt like you might benefit from talking to a professional?",
    emoji: "🧑‍⚕️",
    options: [
      { text: "No, I feel fine", score: 0 },
      { text: "Maybe, but I'm not sure", score: 1 },
      { text: "Yes, I think it could help", score: 2 },
      { text: "Yes, I've been thinking about it for a while", score: 3 },
    ],
  },
];

const stories = [
  { name: "Meera, 24", text: "I kept thinking I wasn't 'sick enough' for therapy. Then I realised — you don't need to be at rock bottom. I started going and it changed everything.", emoji: "🌸" },
  { name: "Arjun, 31", text: "I was skeptical at first. But my therapist helped me see patterns I never noticed. I wish I'd started years earlier.", emoji: "💙" },
  { name: "Priya, 27", text: "I thought therapy was for 'serious' problems. Turns out, everyone deserves a space to be heard. It's not a luxury — it's a need.", emoji: "🌿" },
];

function getResult(score: number) {
  if (score <= 5) return {
    level: "You seem to be doing well",
    emoji: "🌟",
    color: "bg-green-50 border-green-200",
    textColor: "text-green-700",
    message: "Right now, you appear to be managing well. That's wonderful. But remember — therapy isn't just for crisis. It's also for growth, self-understanding, and building resilience. You're always welcome here.",
    cta: "Explore our resources",
    ctaLink: "/resources",
  };
  if (score <= 10) return {
    level: "Some support could be helpful",
    emoji: "🌱",
    color: "bg-amber-50 border-amber-200",
    textColor: "text-amber-700",
    message: "You're managing, but there are signs that some support could make a real difference. Talking to someone — even once — can bring clarity and relief. You don't have to wait until things get harder.",
    cta: "Find a therapist",
    ctaLink: "/therapists",
  };
  if (score <= 16) return {
    level: "Therapy would likely help you",
    emoji: "💙",
    color: "bg-blue-50 border-blue-200",
    textColor: "text-blue-700",
    message: "Based on what you've shared, therapy would likely be genuinely helpful for you. What you're feeling is real and valid — and a professional can offer the kind of support that makes a lasting difference.",
    cta: "Find a therapist",
    ctaLink: "/therapists",
  };
  return {
    level: "We strongly encourage you to reach out",
    emoji: "🤝",
    color: "bg-purple-50 border-purple-200",
    textColor: "text-purple-700",
    message: "It sounds like you're carrying a lot right now. Please know — you don't have to carry it alone. Reaching out to a professional is one of the bravest and most loving things you can do for yourself.",
    cta: "Talk to someone now",
    ctaLink: "/therapists",
  };
}

export default function DoINeedTherapy() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  const answer = (score: number) => {
    const updated = [...answers, score];
    setAnswers(updated);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setDone(true);
    }
  };

  const totalScore = answers.reduce((a, b) => a + b, 0);
  const result = getResult(totalScore);

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

      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Landing */}
        {!started && !done && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <div className="text-6xl mb-6">🧠</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Do I need therapy?</h1>
            <p className="text-gray-500 leading-relaxed mb-4 max-w-lg mx-auto">
              It's one of the most common questions people ask themselves. And the answer is almost always — you deserve support, regardless of how bad things are.
            </p>
            <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
              This is a gentle, non-clinical reflection to help you understand where you are right now. It takes about 2 minutes.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStarted(true)}
              className="bg-[#C084A0] text-white font-semibold px-10 py-4 rounded-full hover:bg-[#a8607f] transition shadow-md text-lg mb-12"
            >
              Begin reflection →
            </motion.button>

            {/* Stories */}
            <div className="text-left mt-4">
              <h2 className="text-xl font-bold text-gray-700 mb-6 text-center">People who felt the same way as you</h2>
              <div className="flex flex-col gap-4">
                {stories.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
                  >
                    <p className="text-sm text-gray-600 leading-relaxed italic mb-3">"{s.text}"</p>
                    <p className="text-xs font-semibold text-gray-400">{s.emoji} {s.name}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Questions */}
        {started && !done && (
          <div>
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Question {current + 1} of {questions.length}</span>
                <span>{Math.round(((current) / questions.length) * 100)}% complete</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <motion.div
                  className="bg-[#C084A0] h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((current) / questions.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">{questions[current].emoji}</div>
                  <h2 className="text-2xl font-bold text-gray-800 leading-snug">
                    {questions[current].question}
                  </h2>
                </div>

                <div className="flex flex-col gap-3">
                  {questions[current].options.map((opt, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => answer(opt.score)}
                      className="bg-white border border-gray-200 hover:border-[#C084A0] hover:bg-pink-50 text-gray-700 font-medium py-4 px-6 rounded-2xl text-sm transition text-left shadow-sm"
                    >
                      {opt.text}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Result */}
        {done && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="text-6xl mb-6">{result.emoji}</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{result.level}</h2>

            <div className={`${result.color} border rounded-3xl p-6 mb-8`}>
              <p className={`${result.textColor} leading-relaxed text-sm`}>
                {result.message}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href={result.ctaLink}
                className="bg-[#C084A0] text-white font-semibold py-4 rounded-2xl hover:bg-[#a8607f] transition"
              >
                {result.cta} →
              </Link>
              <button
                onClick={() => { setCurrent(0); setAnswers([]); setDone(false); setStarted(false); }}
                className="bg-white border border-gray-200 text-gray-600 font-medium py-4 rounded-2xl hover:bg-gray-50 transition text-sm"
              >
                Start over
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-6 leading-relaxed">
              This is a reflection tool, not a clinical assessment. Whatever your result, you are always welcome to seek support — you don't need a reason to deserve care.
            </p>
          </motion.div>
        )}
      </div>

      <SOSModal />
    </main>
  );
}