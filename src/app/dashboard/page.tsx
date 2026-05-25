"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import SOSModal from "@/components/shared/SOSModal";
import { ProfileSkeleton } from "@/components/shared/LoadingSkeleton";
import toast from "react-hot-toast";

type Booking = {
  id: string;
  therapist_name: string;
  date: string;
  time: string;
  session_type: string;
  concern: string;
  status: string;
  is_pro_bono: boolean;
  fee: number;
};

const quickActions = [
  { icon: "🧑‍⚕️", title: "Find a Therapist", desc: "Browse specialists", href: "/therapists" },
  { icon: "📋", title: "Self Assessment", desc: "Take a quiz", href: "/quiz" },
  { icon: "💬", title: "Community", desc: "Join a group", href: "/community" },
  { icon: "📚", title: "Resources", desc: "Find help near you", href: "/resources" },
  { icon: "📝", title: "Blog", desc: "Read articles", href: "/blog" },
  { icon: "💚", title: "Pro Bono", desc: "Free therapy", href: "/probono" },
  { icon: "🎭", title: "Name your feelings", desc: "Identify emotions", href: "/feelings" },
  { icon: "🤔", title: "Do I need therapy?", desc: "Find out", href: "/do-i-need-therapy" },
  { icon: "📊", title: "Feedback", desc: "Share your thoughts", href: "/feedback" },
];

const statusColor = (status: string) => {
  if (status === "pending") return "bg-amber-100 text-amber-700";
  if (status === "confirmed") return "bg-green-100 text-green-700";
  if (status === "rejected") return "bg-red-100 text-red-700";
  if (status === "completed") return "bg-blue-100 text-blue-700";
  return "bg-gray-100 text-gray-700";
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good Morning", emoji: "☀️" };
  if (hour < 17) return { text: "Good Afternoon", emoji: "🌤️" };
  if (hour < 20) return { text: "Good Evening", emoji: "🌅" };
  return { text: "Good Night", emoji: "🌙" };
};

const affirmations = [
  "You are doing better than you think. 💙",
  "Every small step counts. Keep going. 🌱",
  "You deserve peace, rest, and healing. 🌸",
  "It's okay to not be okay. You are not alone. 🤝",
  "Your feelings are valid. Always. 💜",
  "Progress, not perfection. 🌟",
  "You are stronger than you know. 🦋",
];

export default function Dashboard() {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [isTherapist, setIsTherapist] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [streak, setStreak] = useState(0);
  const [moodCheckedToday, setMoodCheckedToday] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("user");
  const router = useRouter();
  const supabase = createClient();

  const greeting = getGreeting();
  const todayAffirmation = affirmations[new Date().getDay() % affirmations.length];

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }
        setUserName(user.user_metadata?.full_name || user.email || "Friend");
        setAvatarUrl(user.user_metadata?.avatar_url || null);

        const { data: profile } = await supabase
          .from("profiles")
          .select("role, streak, last_checkin, avatar_url")
          .eq("id", user.id)
          .maybeSingle();

        const role = profile?.role || "user";
        setUserRole(role);
        setIsTherapist(role === "therapist");
        setIsAdmin(role === "admin");
        setAvatarUrl(profile?.avatar_url || user.user_metadata?.avatar_url || null);

        const today = new Date().toDateString();
        const lastCheckin = profile?.last_checkin
          ? new Date(profile.last_checkin).toDateString()
          : null;
        setMoodCheckedToday(lastCheckin === today);
        setStreak(profile?.streak || 0);

        // Fetch announcement based on role
        const announcementRole = role === "therapist" ? "therapist" : "user";
        const { data: announcementData } = await supabase
          .from("announcements")
          .select("content")
          .eq("role", announcementRole)
          .maybeSingle();
        if (announcementData?.content) {
          setAnnouncement(announcementData.content);
        }

        const { data: bookingsData } = await supabase
          .from("bookings")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        setBookings(bookingsData || []);
        setBookingsLoading(false);
      } catch {
        toast.error("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const handleMoodCheckin = async (mood: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (moodCheckedToday) {
      toast("Already checked in today! 💙", { icon: "✅" });
      return;
    }

    const newStreak = streak + 1;
    await supabase
      .from("profiles")
      .update({
        last_checkin: new Date().toISOString(),
        streak: newStreak,
      })
      .eq("id", user.id);

    setStreak(newStreak);
    setMoodCheckedToday(true);
    toast.success(`Feeling ${mood.split(" ")[1].toLowerCase()} noted! 🔥 ${newStreak} day streak!`);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      toast.error("Failed to upload photo");
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id);

    setAvatarUrl(publicUrl);
    toast.success("Profile photo updated! 🌸");
    setUploading(false);
  };

  const upcomingBookings = bookings.filter(
    (b) => b.status === "pending" || b.status === "confirmed"
  );
  const pastBookings = bookings.filter(
    (b) => b.status === "completed" || b.status === "rejected"
  );
  const completedSessions = bookings.filter((b) => b.status === "completed").length;
  const totalSessions = bookings.length;
  const progressPct = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;
  const circumference = 2 * Math.PI * 20;

  const nextSession = upcomingBookings.find((b) => b.status === "confirmed");
  const daysUntilNext = nextSession
    ? Math.ceil((new Date(nextSession.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f0f7ff] via-[#f7f0ff] to-[#f0fff7]">
      <nav className="flex items-center justify-between px-8 py-5 bg-white/80 backdrop-blur-sm shadow-sm">
        <Link href="/" className="flex items-center gap-2">
          <img src="/mindbridgelogo.png" alt="MindBridge" className="h-14 w-auto" />
        </Link>
        <div className="flex items-center gap-4">
          {isTherapist && (
            <Link href="/therapist-dashboard" className="text-sm font-medium text-[#4A90D9] hover:underline transition">
              Therapist Dashboard →
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" className="text-sm font-medium text-red-500 hover:underline transition">
              Admin Panel →
            </Link>
          )}
          <button onClick={handleLogout} className="text-sm font-medium text-gray-500 hover:text-red-500 transition">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {loading ? (
          <ProfileSkeleton />
        ) : (
          <>
            {/* Announcement Banner */}
            {announcement && (
              <div className="bg-white border border-[#4A90D9]/20 rounded-2xl px-6 py-4 mb-6 flex items-start gap-3 shadow-sm">
                <span className="text-xl mt-0.5">📢</span>
                <div>
                  <p className="text-xs font-semibold text-[#4A90D9] uppercase tracking-wide mb-1">
                    From MindBridge
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">{announcement}</p>
                </div>
              </div>
            )}

            {/* Hero Welcome Card */}
            <div className="bg-gradient-to-br from-[#4A90D9] to-[#7B5EA7] rounded-3xl p-8 shadow-lg mb-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-10 -translate-x-10" />

              <div className="relative flex items-center justify-between flex-wrap gap-6">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 overflow-hidden flex items-center justify-center">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-white">
                          {userName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition shadow">
                      <span className="text-xs">📷</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <p className="text-white/70 text-sm font-medium">
                      {greeting.emoji} {greeting.text}
                    </p>
                    <h1 className="text-2xl font-bold text-white mt-0.5">
                      {userName} 💙
                    </h1>
                    <p className="text-white/70 text-sm mt-1 italic">
                      {todayAffirmation}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 flex-wrap">
                  <div className="bg-white/20 rounded-2xl px-5 py-4 text-center backdrop-blur-sm">
                    <p className="text-2xl font-bold">🔥 {streak}</p>
                    <p className="text-xs text-white/80 mt-1">Day Streak</p>
                  </div>

                  <div className="bg-white/20 rounded-2xl px-5 py-4 text-center backdrop-blur-sm">
                    <div className="relative w-12 h-12 mx-auto">
                      <svg viewBox="0 0 50 50" className="w-12 h-12 -rotate-90">
                        <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="5" />
                        <circle
                          cx="25" cy="25" r="20"
                          fill="none"
                          stroke="white"
                          strokeWidth="5"
                          strokeDasharray={circumference}
                          strokeDashoffset={circumference - (progressPct / 100) * circumference}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                        {progressPct}%
                      </span>
                    </div>
                    <p className="text-xs text-white/80 mt-1">Progress</p>
                  </div>

                  {daysUntilNext !== null && (
                    <div className="bg-white/20 rounded-2xl px-5 py-4 text-center backdrop-blur-sm">
                      <p className="text-2xl font-bold">{daysUntilNext}d</p>
                      <p className="text-xs text-white/80 mt-1">Next Session</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mood check-in */}
            <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800">How are you feeling today?</h2>
                {moodCheckedToday && (
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                    ✅ Checked in today!
                  </span>
                )}
              </div>
              <div className="flex gap-3 flex-wrap">
                {["😊 Great", "😐 Okay", "😔 Low", "😰 Anxious", "😤 Frustrated"].map((mood) => (
                  <button
                    key={mood}
                    onClick={() => handleMoodCheckin(mood)}
                    className={`text-sm px-4 py-2 rounded-full transition border ${
                      moodCheckedToday
                        ? "bg-gray-50 text-gray-400 border-gray-100 cursor-default"
                        : "bg-[#f0f7ff] hover:bg-[#4A90D9] hover:text-white text-gray-600 border-gray-100"
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            {/* Sessions */}
            <div className="bg-white rounded-3xl p-8 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Your Sessions 📅</h2>
                <Link href="/therapists" className="text-sm text-[#4A90D9] hover:underline font-medium">
                  + Book New Session
                </Link>
              </div>

              {bookingsLoading ? (
                <div className="animate-pulse space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-20 bg-gray-100 rounded-2xl" />
                  ))}
                </div>
              ) : upcomingBookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-3xl mb-2">🌸</p>
                  <p className="text-gray-500 text-sm">No upcoming sessions</p>
                  <Link
                    href="/therapists"
                    className="inline-block mt-3 bg-[#4A90D9] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#357ABD] transition"
                  >
                    Find a Therapist
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingBookings.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between p-4 bg-[#f0f7ff] rounded-2xl border border-blue-100"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4A90D9] to-[#7B5EA7] flex items-center justify-center text-white font-bold">
                          {b.therapist_name?.charAt(0) || "T"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{b.therapist_name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(b.date).toLocaleDateString("en-IN", {
                              weekday: "short", day: "numeric", month: "short",
                            })} at {b.time}
                          </p>
                          <p className="text-xs text-gray-400">{b.session_type} · {b.concern}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor(b.status)}`}>
                          {b.status}
                        </span>
                        {b.status === "completed" && (
                          <Link
                            href={`/review/${b.id}`}
                            className="text-xs bg-[#C084A0] text-white px-3 py-1 rounded-full hover:bg-[#a8607f] transition"
                          >
                            ⭐ Review
                          </Link>
                        )}
                        <span className="text-xs text-gray-500">
                          {b.is_pro_bono ? "Free" : `₹${b.fee}`}
                        </span>
                        {b.status === "confirmed" && (
                          <Link
                            href={`/chat/${b.id}`}
                            className="text-xs bg-[#4A90D9] text-white px-3 py-1 rounded-full hover:bg-[#357ABD] transition"
                          >
                            💬 Chat
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {pastBookings.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-500 mb-3">Past Sessions</p>
                  <div className="space-y-2">
                    {pastBookings.map((b) => (
                      <div
                        key={b.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl opacity-75"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                            {b.therapist_name?.charAt(0) || "T"}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700 text-sm">{b.therapist_name}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(b.date).toLocaleDateString("en-IN", {
                                weekday: "short", day: "numeric", month: "short",
                              })} at {b.time}
                            </p>
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor(b.status)}`}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <h2 className="text-xl font-semibold text-gray-700 mb-4">What would you like to do?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col gap-2"
                >
                  <span className="text-3xl">{action.icon}</span>
                  <span className="font-semibold text-gray-800 text-sm">{action.title}</span>
                  <span className="text-xs text-gray-400">{action.desc}</span>
                </Link>
              ))}
            </div>

            {/* Tip of the day */}
            <div className="bg-[#7B5EA7] text-white rounded-3xl p-6">
              <p className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-2">Tip of the day</p>
              <p className="text-lg font-medium leading-relaxed">
                "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, or anxious. Having feelings doesn't make you a negative person — it makes you human."
              </p>
            </div>
          </>
        )}
      </div>

      <SOSModal />
    </main>
  );
}