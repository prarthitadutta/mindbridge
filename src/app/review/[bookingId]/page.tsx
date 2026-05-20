"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ReviewPage() {
  const { bookingId } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [booking, setBooking] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [already, setAlready] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { data: b } = await supabase
      .from("bookings").select("*").eq("id", bookingId).single();
    setBooking(b);

    const { data: existing } = await supabase
      .from("reviews").select("id").eq("booking_id", bookingId).maybeSingle();
    if (existing) setAlready(true);

    setLoading(false);
  };

  const handleSubmit = async () => {
    if (rating === 0) { toast.error("Please select a rating"); return; }
    setSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("reviews").insert({
      user_id: user!.id,
      therapist_id: booking.therapist_id,
      booking_id: bookingId,
      rating,
      review,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Review submitted! Thank you 🌸");
      router.push("/dashboard");
    }
    setSubmitting(false);
  };

  if (loading) return (
    <main className="min-h-screen bg-[#fdf6f0] flex items-center justify-center">
      <p className="text-gray-400 animate-pulse">Loading...</p>
    </main>
  );

  if (!booking || booking.status !== "completed") return (
    <main className="min-h-screen bg-[#fdf6f0] flex items-center justify-center px-4">
      <div className="text-center bg-white rounded-3xl p-8 shadow-sm max-w-sm">
        <p className="text-4xl mb-3">⏳</p>
        <p className="text-gray-600 font-medium">Reviews are only available after a completed session.</p>
        <Link href="/dashboard" className="inline-block mt-4 text-[#4A90D9] text-sm hover:underline">← Back to Dashboard</Link>
      </div>
    </main>
  );

  if (already) return (
    <main className="min-h-screen bg-[#fdf6f0] flex items-center justify-center px-4">
      <div className="text-center bg-white rounded-3xl p-8 shadow-sm max-w-sm">
        <p className="text-4xl mb-3">✅</p>
        <p className="text-gray-600 font-medium">You've already reviewed this session!</p>
        <Link href="/dashboard" className="inline-block mt-4 text-[#4A90D9] text-sm hover:underline">← Back to Dashboard</Link>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-[#fdf6f0] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-sm p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-[#4A90D9]">
            Mind<span className="text-[#C084A0]">Bridge</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-800 mt-4">Rate your session</h1>
          <p className="text-gray-500 text-sm mt-1">with {booking.therapist_name}</p>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-3 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="text-4xl transition-transform hover:scale-110"
            >
              {star <= (hover || rating) ? "⭐" : "☆"}
            </button>
          ))}
        </div>

        {rating > 0 && (
          <p className="text-center text-sm text-gray-500 mb-6">
            {["", "Poor", "Fair", "Good", "Very Good", "Excellent!"][rating]}
          </p>
        )}

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your experience (optional)..."
          rows={4}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9] resize-none mb-6"
        />

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-[#C084A0] text-white font-semibold py-3 rounded-xl hover:bg-[#a8607f] transition disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit Review 🌸"}
        </button>

        <Link href="/dashboard" className="block text-center text-sm text-gray-400 mt-4 hover:text-gray-600">
          Skip for now
        </Link>
      </div>
    </main>
  );
}