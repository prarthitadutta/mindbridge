"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import SOSModal from "@/components/shared/SOSModal";

const questions = [
  {
    id: "overall",
    question: "How would you rate your overall experience with MindBridge?",
    type: "rating",
  },
  {
    id: "helpful",
    question: "How helpful did you find the resources and tools?",
    type: "rating",
  },
  {
    id: "feature",
    question: "Which feature did you find most valuable?",
    type: "choice",
    options: [
      "Therapist directory",
      "Self assessment quizzes",
      "Community support",
      "SOS distress button",
      "Name your feelings",
      "Pro bono matching",
      "Blog & awareness",
      "Resources directory",
    ],
  },
  {
    id: "missing",
    question: "Is there anything you wished MindBridge had that it currently doesn't?",
    type: "text",
    placeholder: "Tell us what would make this platform better for you...",
  },
  {
    id: "story",
    question: "Would you like to share how MindBridge has helped you? (Optional)",
    type: "text",
    placeholder: "Your story could inspire someone else to seek help...",
  },
  {
    id: "recommend",
    question: "How likely are you to recommend MindBridge to someone you care about?",
    type: "nps",
  },
];

const emojis = ["😞", "😕", "😐", "🙂", "😊"];
const labels = ["Poor", "Fair", "Okay", "Good", "Excellent"];

export default function Feedback() {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [nps, setNps] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => setSubmitted(true);

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

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <div className="text-center mb-12">
                <div className="text-5xl mb-4">💌</div>
                <h1 className="text-4xl font-bold text-gray-800 mb-3">Share your feedback</h1>
                <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
                  Your experience shapes MindBridge. Every response helps us build something better for the people who need it most.
                </p>
              </div>

              <div className="flex flex-col gap-6">
                {questions.map((q, i) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                  >
                    <p className="text-sm font-semibold text-gray-800 mb-4">{q.question}</p>

                    {/* Rating */}
                    {q.type === "rating" && (
                      <div className="flex gap-3 justify-center">
                        {emojis.map((emoji, val) => (
                          <button
                            key={val}
                            onClick={() => setRatings({ ...ratings, [q.id]: val })}
                            className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition ${
                              ratings[q.id] === val
                                ? "border-[#C084A0] bg-pink-50"
                                : "border-gray-100 hover:border-[#C084A0]"
                            }`}
                          >
                            <span className="text-2xl">{emoji}</span>
                            <span className="text-xs text-gray-400">{labels[val]}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Choice */}
                    {q.type === "choice" && q.options && (
                      <div className="grid grid-cols-2 gap-2">
                        {q.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setChoices({ ...choices, [q.id]: opt })}
                            className={`text-xs py-2.5 px-3 rounded-xl border transition text-left ${
                              choices[q.id] === opt
                                ? "bg-[#C084A0] text-white border-[#C084A0]"
                                : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#C084A0]"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Text */}
                    {q.type === "text" && (
                      <textarea
                        rows={3}
                        placeholder={q.placeholder}
                        value={texts[q.id] || ""}
                        onChange={(e) => setTexts({ ...texts, [q.id]: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C084A0] resize-none text-gray-600"
                      />
                    )}

                    {/* NPS */}
                    {q.type === "nps" && (
                      <div>
                        <div className="flex gap-1 justify-between mb-2">
                          {[...Array(11)].map((_, val) => (
                            <button
                              key={val}
                              onClick={() => setNps(val)}
                              className={`w-9 h-9 rounded-xl text-xs font-bold border-2 transition ${
                                nps === val
                                  ? val <= 6
                                    ? "bg-red-400 text-white border-red-400"
                                    : val <= 8
                                    ? "bg-amber-400 text-white border-amber-400"
                                    : "bg-green-400 text-white border-green-400"
                                  : "border-gray-200 text-gray-500 hover:border-[#C084A0]"
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Not likely</span>
                          <span>Extremely likely</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  className="w-full bg-[#C084A0] text-white font-semibold py-4 rounded-2xl hover:bg-[#a8607f] transition shadow-md text-lg"
                >
                  Submit feedback 💌
                </motion.button>

                <p className="text-xs text-gray-400 text-center">
                  Your feedback is anonymous and helps us improve MindBridge for everyone.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
                className="text-7xl mb-6"
              >
                🌸
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Thank you so much</h2>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto mb-8">
                Your feedback means everything to us. Every response helps us build a more compassionate, useful platform for people who need it.
              </p>
              <div className="bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 rounded-3xl p-8 mb-8 max-w-sm mx-auto">
                <p className="text-gray-700 font-medium italic text-sm leading-relaxed">
                  "Like flowers that grow through concrete, your healing begins the moment you reach for the light." 🌸
                </p>
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