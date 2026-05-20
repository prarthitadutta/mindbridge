"use client";
import { useState } from "react";
import Link from "next/link";
import SOSModal from "@/components/shared/SOSModal";
import { createClient } from "@/lib/supabase/client";

const quizzes = [
  {
    id: "phq9",
    title: "Depression Screening",
    subtitle: "PHQ-9",
    emoji: "🌧️",
    desc: "Measures symptoms of depression over the last 2 weeks",
    color: "bg-blue-50 border-blue-200",
    questions: [
      "Little interest or pleasure in doing things",
      "Feeling down, depressed, or hopeless",
      "Trouble falling or staying asleep, or sleeping too much",
      "Feeling tired or having little energy",
      "Poor appetite or overeating",
      "Feeling bad about yourself or that you are a failure",
      "Trouble concentrating on things",
      "Moving or speaking slowly — or being fidgety or restless",
      "Thoughts that you would be better off dead or hurting yourself",
    ],
  },
  {
    id: "gad7",
    title: "Anxiety Screening",
    subtitle: "GAD-7",
    emoji: "⚡",
    desc: "Measures symptoms of generalised anxiety over the last 2 weeks",
    color: "bg-yellow-50 border-yellow-200",
    questions: [
      "Feeling nervous, anxious, or on edge",
      "Not being able to stop or control worrying",
      "Worrying too much about different things",
      "Trouble relaxing",
      "Being so restless that it is hard to sit still",
      "Becoming easily annoyed or irritable",
      "Feeling afraid as if something awful might happen",
    ],
  },
  {
    id: "burnout",
    title: "Burnout Check",
    subtitle: "Burnout Scale",
    emoji: "🔥",
    desc: "Measures emotional and physical exhaustion from work or life",
    color: "bg-orange-50 border-orange-200",
    questions: [
      "I feel emotionally drained from my work or daily life",
      "I feel used up at the end of the day",
      "I feel tired when I get up and have to face another day",
      "Working or doing daily tasks is a strain for me",
      "I feel burned out from my work or responsibilities",
      "I feel frustrated by my work or situation",
      "I feel I am working too hard",
    ],
  },
];

const options = ["Not at all", "Several days", "More than half the days", "Nearly every day"];

function getResult(score: number, total: number) {
  const pct = score / total;
  if (pct < 0.25) return { label: "Minimal", color: "text-green-600", bg: "bg-green-50", advice: "You seem to be doing well. Keep taking care of yourself!" };
  if (pct < 0.5) return { label: "Mild", color: "text-yellow-600", bg: "bg-yellow-50", advice: "Some symptoms present. Consider talking to someone you trust or a professional." };
  if (pct < 0.75) return { label: "Moderate", color: "text-orange-600", bg: "bg-orange-50", advice: "Moderate symptoms detected. We recommend speaking with a mental health professional." };
  return { label: "Severe", color: "text-red-600", bg: "bg-red-50", advice: "Significant symptoms present. Please reach out to a professional as soon as possible." };
}

export default function Quiz() {
  const [selected, setSelected] = useState<typeof quizzes[0] | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const startQuiz = (quiz: typeof quizzes[0]) => {
    setSelected(quiz);
    setAnswers([]);
    setDone(false);
  };

  const answer = (i: number, val: number) => {
    const updated = [...answers];
    updated[i] = val;
    setAnswers(updated);
  };

  const submit = async () => {
    setDone(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user && selected) {
        await supabase.from("quiz_results").insert({
          user_id: user.id,
          quiz_type: selected.id,
          score: answers.reduce((a, b) => a + b, 0),
          answers: answers,
        });
      }
    } catch (e) {
      console.error("Could not save quiz result", e);
    }
  };

  const score = answers.reduce((a, b) => a + b, 0);
  const maxScore = selected ? selected.questions.length * 3 : 0;
  const result = selected && done ? getResult(score, maxScore) : null;

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

      <div className="max-w-3xl mx-auto px-6 py-10">
        {!selected && (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Self Assessment</h1>
            <p className="text-gray-500 mb-2">Clinically-backed screenings to help you understand yourself better.</p>
            <p className="text-xs text-gray-400 mb-8">⚠️ These are screening tools, not diagnoses. Always consult a professional.</p>
            <div className="flex flex-col gap-4">
              {quizzes.map((q) => (
                <div key={q.id} className={`bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition cursor-pointer ${q.color}`} onClick={() => startQuiz(q)}>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{q.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-800">{q.title}</h3>
                        <span className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-400 border">{q.subtitle}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{q.desc}</p>
                    </div>
                    <span className="text-gray-300 text-xl">→</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {selected && !done && (
          <>
            <button onClick={() => setSelected(null)} className="text-sm text-gray-400 hover:text-gray-600 mb-6 block">← Back to quizzes</button>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">{selected.title}</h1>
            <p className="text-gray-500 text-sm mb-8">Over the last 2 weeks, how often have you been bothered by the following?</p>
            <div className="flex flex-col gap-6">
              {selected.questions.map((q, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-4">{i + 1}. {q}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {options.map((opt, val) => (
                      <button
                        key={opt}
                        onClick={() => answer(i, val)}
                        className={`text-xs py-2.5 px-3 rounded-xl border transition text-left ${
                          answers[i] === val
                            ? "bg-[#4A90D9] text-white border-[#4A90D9]"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#4A90D9]"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={submit}
              disabled={answers.length < selected.questions.length || answers.some((a) => a === undefined)}
              className="mt-8 w-full bg-[#4A90D9] text-white font-semibold py-4 rounded-2xl hover:bg-[#357ABD] transition disabled:opacity-40"
            >
              See My Results
            </button>
          </>
        )}

        {selected && done && result && (
          <div className="text-center">
            <div className="text-5xl mb-4">{selected.emoji}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{selected.title} Results</h2>
            <div className={`${result.bg} rounded-2xl p-6 mb-6`}>
              <p className="text-sm text-gray-500 mb-1">Your score</p>
              <p className={`text-4xl font-bold ${result.color}`}>{score} / {maxScore}</p>
              <p className={`text-lg font-semibold mt-2 ${result.color}`}>{result.label}</p>
              <p className="text-sm text-gray-600 mt-3">{result.advice}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/therapists" className="bg-[#4A90D9] text-white font-semibold py-3 rounded-2xl hover:bg-[#357ABD] transition">
                Find a Therapist
              </Link>
              <button onClick={() => { setSelected(null); setDone(false); }} className="bg-white text-gray-600 font-semibold py-3 rounded-2xl border border-gray-200 hover:bg-gray-50 transition">
                Take Another Quiz
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-6">This is a screening tool, not a clinical diagnosis. Please consult a mental health professional for proper evaluation.</p>
          </div>
        )}
      </div>

      <SOSModal />
    </main>
  );
}