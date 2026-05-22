"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import SOSModal from "@/components/shared/SOSModal";

const sessionTypes = ["Video Call", "Phone Call", "Chat"];
const concerns = [
  "Anxiety", "Depression", "Stress", "Relationship Issues",
  "Trauma", "Grief", "Work Burnout", "Self Esteem", "Other",
];

function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  const therapistId = searchParams.get("therapist_id");
  const therapistName = searchParams.get("name") || "Your Therapist";
  const fee = searchParams.get("fee") || "0";
  const isProBono = searchParams.get("pro_bono") === "true";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");
  const [availability, setAvailability] = useState<Record<string, string[]>>({});
  const [availableDates, setAvailableDates] = useState<{ value: string; label: string; dayName: string }[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionType, setSessionType] = useState("Video Call");
  const [concern, setConcern] = useState("");
  const [notes, setNotes] = useState("");
  const [therapistUserId, setTherapistUserId] = useState("");

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    if (!therapistId) return;
    const fetchAvailability = async () => {
      const { data, error } = await supabase
        .from("therapist_profiles")
        .select("availability, user_id")
        .eq("user_id", therapistId)
        .single();

      if (error) {
        setAvailabilityError("Could not load therapist availability. Please try again.");
        return;
      }

      if (!data?.availability || Object.keys(data.availability).length === 0) {
        setAvailabilityError("This therapist hasn't set their availability yet. Please try another therapist or check back later.");
        return;
      }

      setAvailability(data.availability);
      setTherapistUserId(data.user_id);

      // Generate next 30 days, filter to only days therapist is available
      const dates: { value: string; label: string; dayName: string }[] = [];
      for (let i = 1; i <= 30; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        const dayName = dayNames[d.getDay()];
        if (data.availability[dayName] && data.availability[dayName].length > 0) {
          dates.push({
            value: d.toISOString().split("T")[0],
            label: d.toLocaleDateString("en-IN", {
              weekday: "short", day: "numeric", month: "short",
            }),
            dayName,
          });
        }
      }
      setAvailableDates(dates);
    };

    fetchAvailability();
  }, [therapistId]);

  useEffect(() => {
    if (!selectedDate) return;
    const d = new Date(selectedDate);
    const dayName = dayNames[d.getDay()];
    setAvailableTimeSlots(availability[dayName] || []);
    setSelectedTime("");
  }, [selectedDate, availability]);

  const saveBooking = async (user: any) => {
    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      therapist_id: therapistId,
      therapist_name: therapistName,
      date: selectedDate,
      time: selectedTime,
      session_type: sessionType,
      concern,
      notes,
      fee: isProBono ? 0 : parseInt(fee),
      is_pro_bono: isProBono,
      status: "pending",
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      await fetch("/api/send-booking-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user.email,
          userName: user.email?.split("@")[0],
          therapistName,
          therapistUserId,
          date: new Date(selectedDate).toLocaleDateString("en-IN", {
            weekday: "long", day: "numeric", month: "long",
          }),
          time: selectedTime,
          sessionType,
          concern,
          isProBono,
          fee,
        }),
      });
      toast.success("Session booked! 🎉");
      setStep(4);
      setLoading(false);
    }
  };

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if ((window as any).Razorpay) { resolve(true); return; }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleConfirm = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Please log in first"); router.push("/login"); return; }

    if (!isProBono && parseInt(fee) > 0) {
      try {
        const res = await fetch("/api/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: parseInt(fee), receipt: `booking_${user.id}_${Date.now()}` }),
        });
        const data = await res.json();
        if (!data.orderId) { toast.error("Could not initiate payment."); setLoading(false); return; }

        const loaded = await loadRazorpay();
        if (!loaded) { toast.error("Razorpay failed to load."); setLoading(false); return; }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: parseInt(fee) * 100,
          currency: "INR",
          name: "MindBridge",
          description: `Session with ${therapistName}`,
          order_id: data.orderId,
          handler: async () => { await saveBooking(user); },
          modal: { ondismiss: () => { toast.error("Payment cancelled"); setLoading(false); } },
          prefill: { email: user.email },
          theme: { color: "#4A90D9" },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } catch (error) {
        toast.error("Payment failed. Please try again.");
        setLoading(false);
      }
    } else {
      await saveBooking(user);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f0f7ff] via-[#f7f0ff] to-[#f0fff7] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-[#4A90D9]">
            Mind<span className="text-[#C084A0]">Bridge</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">Book a Session</h1>
          <p className="text-gray-500 text-sm mt-1">with {therapistName}</p>
        </div>

        {step < 4 && (
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-2 flex-1 rounded-full transition-all ${s <= step ? "bg-[#4A90D9]" : "bg-gray-200"}`} />
            ))}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm p-8">

          {/* Availability Error */}
          {availabilityError && step === 1 && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="text-5xl">😔</div>
              <h2 className="text-lg font-semibold text-gray-800">Availability Not Set</h2>
              <p className="text-sm text-gray-500 max-w-sm">{availabilityError}</p>
              <Link href="/therapists" className="bg-[#4A90D9] text-white font-semibold py-3 px-6 rounded-xl hover:bg-[#357ABD] transition">
                Browse Other Therapists
              </Link>
            </div>
          )}

          {/* Step 1 — Date & Time */}
          {step === 1 && !availabilityError && (
            <div className="flex flex-col gap-6">
              <h2 className="text-lg font-semibold text-gray-800">Choose Date & Time</h2>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">Select a Date</label>
                {availableDates.length === 0 ? (
                  <p className="text-sm text-gray-500 animate-pulse">Loading available dates...</p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableDates.map((d) => (
                      <button
                        key={d.value}
                        onClick={() => setSelectedDate(d.value)}
                        className={`p-2 rounded-xl text-xs font-medium border transition text-center ${
                          selectedDate === d.value
                            ? "bg-[#4A90D9] text-white border-[#4A90D9]"
                            : "bg-white text-gray-600 border-gray-200 hover:border-[#4A90D9]"
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedDate && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">Select a Time</label>
                  {availableTimeSlots.length === 0 ? (
                    <p className="text-sm text-gray-500">No slots available for this day.</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {availableTimeSlots.map((t) => (
                        <button
                          key={t}
                          onClick={() => setSelectedTime(t)}
                          className={`py-2 rounded-xl text-xs font-medium border transition ${
                            selectedTime === t
                              ? "bg-[#4A90D9] text-white border-[#4A90D9]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-[#4A90D9]"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">Session Type</label>
                <div className="flex gap-3">
                  {sessionTypes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSessionType(s)}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium border transition ${
                        sessionType === s
                          ? "bg-[#4A90D9] text-white border-[#4A90D9]"
                          : "bg-white text-gray-600 border-gray-200 hover:border-[#4A90D9]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  if (!selectedDate || !selectedTime) { toast.error("Please select a date and time"); return; }
                  setStep(2);
                }}
                className="bg-[#4A90D9] text-white font-semibold py-3 rounded-xl hover:bg-[#357ABD] transition"
              >
                Next →
              </button>
            </div>
          )}

          {/* Step 2 — Session Details */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-lg font-semibold text-gray-800">Session Details</h2>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">What would you like to focus on?</label>
                <div className="flex flex-wrap gap-2">
                  {concerns.map((c) => (
                    <button key={c} onClick={() => setConcern(c)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                        concern === c ? "bg-[#C084A0] text-white border-[#C084A0]" : "bg-white text-gray-600 border-gray-200 hover:border-[#C084A0]"
                      }`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Anything else you'd like your therapist to know? <span className="text-gray-400">(optional)</span>
                </label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share anything that might help your therapist prepare..."
                  rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9] resize-none" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition">← Back</button>
                <button onClick={() => { if (!concern) { toast.error("Please select a concern"); return; } setStep(3); }}
                  className="flex-1 bg-[#4A90D9] text-white font-semibold py-3 rounded-xl hover:bg-[#357ABD] transition">Next →</button>
              </div>
            </div>
          )}

          {/* Step 3 — Confirm */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-lg font-semibold text-gray-800">Confirm Booking</h2>
              <div className="bg-[#f0f7ff] rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Therapist</span><span className="font-medium text-gray-800">{therapistName}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Date</span><span className="font-medium text-gray-800">{new Date(selectedDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Time</span><span className="font-medium text-gray-800">{selectedTime}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Session Type</span><span className="font-medium text-gray-800">{sessionType}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Focus Area</span><span className="font-medium text-gray-800">{concern}</span></div>
                <div className="border-t border-blue-100 pt-3 flex justify-between text-sm"><span className="text-gray-500">Fee</span><span className="font-bold text-gray-800">{isProBono ? "Free (Pro Bono)" : `₹${fee}`}</span></div>
              </div>
              {!isProBono && parseInt(fee) > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-700 flex items-center gap-2">
                  💳 You will be redirected to a secure Razorpay payment page.
                </div>
              )}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-700">
                ⏰ Your therapist will confirm the session within 24 hours.
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition">← Back</button>
                <button onClick={handleConfirm} disabled={loading}
                  className="flex-1 bg-[#C084A0] text-white font-semibold py-3 rounded-xl hover:bg-[#a8607f] transition disabled:opacity-60">
                  {loading ? "Processing..." : isProBono || parseInt(fee) === 0 ? "Confirm Booking 🌸" : `Pay ₹${fee} & Book`}
                </button>
              </div>
            </div>
          )}

          {/* Step 4 — Success */}
          {step === 4 && (
            <div className="text-center flex flex-col items-center gap-4 py-6">
              <div className="text-6xl">🎉</div>
              <h2 className="text-2xl font-bold text-gray-800">Booking Confirmed!</h2>
              <p className="text-gray-500 text-sm max-w-sm">
                Your session with <strong>{therapistName}</strong> on{" "}
                {new Date(selectedDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}{" "}
                at {selectedTime} has been requested. They will confirm within 24 hours.
              </p>
              <p className="text-xs text-gray-400">A confirmation email has been sent to your inbox 📧</p>
              <div className="flex flex-col gap-3 w-full max-w-xs mt-4">
                <Link href="/dashboard" className="bg-[#4A90D9] text-white font-semibold py-3 rounded-xl hover:bg-[#357ABD] transition text-center">Go to Dashboard</Link>
                <Link href="/therapists" className="bg-white border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition text-center text-sm">Browse more therapists</Link>
              </div>
            </div>
          )}

        </div>
      </div>
      <SOSModal />
    </main>
  );
}

export default function Booking() {
  return (
    <Suspense>
      <BookingForm />
    </Suspense>
  );
}