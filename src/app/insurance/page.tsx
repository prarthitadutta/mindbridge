"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import toast from "react-hot-toast";

const insurancePartners = [
  { name: "Star Health Insurance", logo: "⭐", covered: ["Individual therapy", "Group therapy", "Psychiatric consultation"], limit: "₹50,000/year", cashless: true },
  { name: "HDFC ERGO Health", logo: "🏥", covered: ["Individual therapy", "Burnout counselling"], limit: "₹30,000/year", cashless: true },
  { name: "Niva Bupa", logo: "💙", covered: ["Mental health OPD", "Therapy sessions", "Psychiatric medicines"], limit: "₹40,000/year", cashless: false },
  { name: "Care Health Insurance", logo: "🌿", covered: ["Therapy sessions", "Stress counselling"], limit: "₹25,000/year", cashless: false },
  { name: "Aditya Birla Health", logo: "🔶", covered: ["Individual therapy", "Couples therapy", "Psychiatric consultation"], limit: "₹60,000/year", cashless: true },
  { name: "Max Bupa", logo: "💚", covered: ["Mental health OPD", "Therapy sessions"], limit: "₹35,000/year", cashless: true },
];

const steps = [
  { icon: "📋", title: "Check your policy", desc: "Verify your insurance plan covers mental health sessions" },
  { icon: "📅", title: "Book a session", desc: "Book with any verified MindBridge therapist" },
  { icon: "🧾", title: "Download receipt", desc: "Get a detailed session receipt from your dashboard" },
  { icon: "💰", title: "File your claim", desc: "Submit receipt to your insurer for reimbursement" },
];

export default function InsurancePage() {
  const supabase = createClient();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (!user) { setLoading(false); return; }

    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .order("created_at", { ascending: false });

    setBookings(data || []);
    setLoading(false);
  };

  const downloadReceipt = (booking: any) => {
    const content = `
MINDBRIDGE SESSION RECEIPT
==========================
Receipt No: MB-${booking.id.substring(0, 8).toUpperCase()}
Date: ${new Date(booking.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
Time: ${booking.time}

PATIENT DETAILS
---------------
User ID: ${booking.user_id.substring(0, 8)}...

SESSION DETAILS
---------------
Therapist: ${booking.therapist_name}
Session Type: ${booking.session_type}
Focus Area: ${booking.concern}
Duration: 50 minutes

PAYMENT DETAILS
---------------
Amount Paid: ${booking.is_pro_bono ? "₹0 (Pro Bono)" : `₹${booking.fee}`}
Payment Status: Completed

This receipt is valid for insurance reimbursement claims.
MindBridge Mental Health Platform | mindbridge.in
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MindBridge-Receipt-${booking.id.substring(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Receipt downloaded! 🧾");
  };

  return (
    <main className="min-h-screen bg-[#fdf6f0]">
      <nav className="flex items-center justify-between px-8 py-5 bg-white/80 backdrop-blur-sm shadow-sm">
        <Link href="/" className="text-2xl font-bold text-[#4A90D9]">
          Mind<span className="text-[#C084A0]">Bridge</span>
        </Link>
        <Link href={user ? "/dashboard" : "/login"} className="text-sm text-gray-500 hover:text-[#4A90D9] transition">
          {user ? "← Dashboard" : "Login"}
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-8 py-16 text-center max-w-3xl mx-auto">
        <span className="bg-green-100 text-green-700 text-xs font-semibold px-4 py-1.5 rounded-full">
          🏥 Insurance & Reimbursement
        </span>
        <h1 className="text-4xl font-bold text-gray-800 mt-6 mb-4">
          Use your insurance for <span className="text-[#4A90D9]">therapy</span>
        </h1>
        <p className="text-gray-500 text-lg leading-relaxed">
          MindBridge works with major Indian insurers. Book a session, get a receipt, and claim reimbursement easily.
        </p>
      </section>

      {/* How it works */}
      <section className="px-8 py-12 bg-white/60">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-10">How to claim reimbursement</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-3">{s.icon}</div>
                <p className="text-xs font-bold text-[#4A90D9] tracking-widest mb-1">0{i + 1}</p>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{s.title}</h3>
                <p className="text-xs text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance Partners */}
      <section className="px-8 py-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-10">Partner Insurance Companies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {insurancePartners.map((ins) => (
            <div key={ins.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{ins.logo}</span>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{ins.name}</h3>
                  {ins.cashless && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      ✓ Cashless Available
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-3">Coverage limit: <span className="font-semibold text-gray-700">{ins.limit}</span></p>
              <ul className="space-y-1">
                {ins.covered.map((c) => (
                  <li key={c} className="text-xs text-gray-600 flex items-center gap-1">
                    <span className="text-green-500">✓</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">
          * Coverage details may vary by policy. Please verify with your insurer.
        </p>
      </section>

      {/* Session Receipts */}
      <section className="px-8 py-16 bg-white/60">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-3">Your Session Receipts</h2>
          <p className="text-gray-500 text-sm text-center mb-8">Download receipts for completed sessions to submit insurance claims</p>

          {!user ? (
            <div className="text-center bg-white rounded-2xl p-8 shadow-sm">
              <p className="text-gray-500 mb-4">Login to view and download your session receipts</p>
              <Link href="/login" className="bg-[#4A90D9] text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-[#357ABD] transition">
                Login
              </Link>
            </div>
          ) : loading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-2xl" />)}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center bg-white rounded-2xl p-8 shadow-sm">
              <p className="text-4xl mb-3">🧾</p>
              <p className="text-gray-500 text-sm">No completed sessions yet</p>
              <Link href="/therapists" className="inline-block mt-3 bg-[#4A90D9] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#357ABD] transition">
                Book a Session
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div key={b.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{b.therapist_name}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(b.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {b.session_type}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {b.is_pro_bono ? "Free (Pro Bono)" : `₹${b.fee}`}
                    </p>
                  </div>
                  <button
                    onClick={() => downloadReceipt(b)}
                    className="bg-[#4A90D9] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#357ABD] transition flex items-center gap-2"
                  >
                    📥 Download Receipt
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-8 py-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Common Questions</h2>
        <div className="space-y-4">
          {[
            { q: "Are all MindBridge therapists eligible for insurance claims?", a: "Only verified therapists with RCI/MCI registration are eligible for insurance reimbursement. Look for the ✓ Verified badge." },
            { q: "How long does reimbursement take?", a: "Typically 7-15 working days after submitting your claim with the receipt." },
            { q: "What documents do I need?", a: "You need the session receipt (downloadable above), your insurance card, and a prescription if required by your insurer." },
            { q: "Is online therapy covered?", a: "Yes! Most insurers now cover teleconsultation and online therapy sessions post-COVID." },
          ].map((faq) => (
            <div key={faq.q} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-2 text-sm">{faq.q}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-8 py-6 bg-white text-center">
        <p className="text-sm text-gray-400">
          © 2026 MindBridge |{" "}
          <Link href="/" className="text-[#4A90D9] hover:underline">Back to Home</Link>
        </p>
      </footer>
    </main>
  );
}