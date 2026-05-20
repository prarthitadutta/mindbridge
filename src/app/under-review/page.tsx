import Link from "next/link";

export default function UnderReview() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f0f7ff] via-[#f7f0ff] to-[#f0fff7] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm p-10 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Profile Under Review</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Thank you for joining MindBridge as a therapist! Our team is reviewing your profile and credentials. This usually takes <strong>1-2 business days</strong>.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-left">
          <p className="text-sm font-semibold text-amber-700 mb-2">What happens next?</p>
          <ul className="text-xs text-amber-600 space-y-1">
            <li>✅ Complete your therapist profile below</li>
            <li>⏳ Our team reviews your credentials</li>
            <li>📧 You'll get an email once approved</li>
            <li>🟢 Your profile goes live on MindBridge</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/therapist-onboarding"
            className="bg-[#C084A0] text-white font-semibold py-3 rounded-xl hover:bg-[#a8607f] transition"
          >
            Complete Your Profile 🌸
          </Link>
          <Link
            href="/"
            className="bg-white border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition text-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}