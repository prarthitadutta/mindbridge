"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function validate(fullName: string, email: string, password: string) {
  const errors: { fullName?: string; email?: string; password?: string } = {};
  if (!fullName.trim()) errors.fullName = "Full name is required";
  if (!email) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address";
  if (!password) errors.password = "Password is required";
  else if (password.length < 6) errors.password = "Password must be at least 6 characters";
  return errors;
}

export default function SignUp() {
  const [role, setRole] = useState<"user" | "therapist" | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ fullName: false, email: false, password: false });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const errors = validate(fullName, email, password);
  const isValid = Object.keys(errors).length === 0;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ fullName: true, email: true, password: true });
    if (!isValid) return;
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role === "therapist" ? "pending_therapist" : "user",
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      if (role === "therapist") {
        toast.success("Account created! Please complete your profile 🌸");
        router.push("/login?message=Account created! Log in to complete your therapist profile.");
      } else {
        toast.success("Account created! Check your email to confirm 🌸");
        router.push("/login?message=Check your email to confirm your account");
      }
    }
  };

  const handleGoogleSignUp = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          role: role === "therapist" ? "pending_therapist" : "user",
        },
      },
    });
    if (error) toast.error(error.message);
  };

  // Step 1 — Role selection
  if (!role) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#f0f7ff] via-[#f7f0ff] to-[#f0fff7] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="text-2xl font-bold text-[#4A90D9]">
              Mind<span className="text-[#C084A0]">Bridge</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 mt-4">Join MindBridge</h1>
            <p className="text-gray-500 text-sm mt-2">Who are you signing up as?</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => setRole("user")}
              className="bg-white rounded-3xl p-8 shadow-sm border-2 border-gray-100 hover:border-[#4A90D9] transition text-left group"
            >
              <div className="text-5xl mb-4">🧑‍💼</div>
              <h2 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-[#4A90D9]">
                I'm looking for support
              </h2>
              <p className="text-sm text-gray-500">
                Find a therapist, take self-assessments, join the community and access mental health resources.
              </p>
              <div className="mt-4 text-xs text-[#4A90D9] font-semibold">
                Sign up as Patient →
              </div>
            </button>

            <button
              onClick={() => setRole("therapist")}
              className="bg-white rounded-3xl p-8 shadow-sm border-2 border-gray-100 hover:border-[#C084A0] transition text-left group"
            >
              <div className="text-5xl mb-4">🧑‍⚕️</div>
              <h2 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-[#C084A0]">
                I'm a mental health professional
              </h2>
              <p className="text-sm text-gray-500">
                Create your therapist profile, receive booking requests and connect with clients who need your support.
              </p>
              <div className="mt-4 text-xs text-[#C084A0] font-semibold">
                Sign up as Therapist →
              </div>
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#4A90D9] font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </main>
    );
  }

  // Step 2 — Fill in details
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f0f7ff] via-[#f7f0ff] to-[#f0fff7] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="text-2xl font-bold text-[#4A90D9]">
            Mind<span className="text-[#7B5EA7]">Bridge</span>
          </Link>
          <div className="mt-3 inline-flex items-center gap-2 bg-gray-50 rounded-full px-4 py-1.5">
            <span>{role === "user" ? "🧑‍💼" : "🧑‍⚕️"}</span>
            <span className="text-sm text-gray-600 font-medium">
              {role === "user" ? "Signing up as Patient" : "Signing up as Therapist"}
            </span>
            <button
              onClick={() => setRole(null)}
              className="text-xs text-gray-400 hover:text-gray-600 ml-1"
            >
              Change
            </button>
          </div>
        </div>

        {role === "therapist" && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-4 text-xs text-amber-700">
            🔍 After signing up, you'll complete your profile. Our team will review and verify you before your profile goes live.
          </div>
        )}

        <form onSubmit={handleSignUp} className="flex flex-col gap-4" noValidate>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
              placeholder="Your name"
              className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition ${
                touched.fullName && errors.fullName
                  ? "border-red-400 focus:ring-red-200 bg-red-50"
                  : "border-gray-200 focus:ring-[#4A90D9]"
              }`}
            />
            {touched.fullName && errors.fullName && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              placeholder="you@example.com"
              className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition ${
                touched.email && errors.email
                  ? "border-red-400 focus:ring-red-200 bg-red-50"
                  : "border-gray-200 focus:ring-[#4A90D9]"
              }`}
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              placeholder="Min 6 characters"
              className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition ${
                touched.password && errors.password
                  ? "border-red-400 focus:ring-red-200 bg-red-50"
                  : "border-gray-200 focus:ring-[#4A90D9]"
              }`}
            />
            {touched.password && errors.password && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`text-white font-semibold py-3 rounded-xl transition mt-2 disabled:opacity-60 ${
              role === "therapist"
                ? "bg-[#C084A0] hover:bg-[#a8607f]"
                : "bg-[#4A90D9] hover:bg-[#357ABD]"
            }`}
          >
            {loading ? "Creating account..." : role === "therapist" ? "Create Therapist Account 🌸" : "Create Account"}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 text-gray-400">or</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignUp}
          className="flex items-center justify-center gap-3 w-full border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.5-2.6 4.6-4.8 6l6.2 5.2C40.8 35.5 44 30.1 44 24c0-1.3-.1-2.7-.4-4z"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#4A90D9] font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}