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