import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "₹999",
    per: "per employee/month",
    employees: "Up to 50 employees",
    color: "bg-blue-50 border-blue-200",
    btnColor: "bg-[#4A90D9] hover:bg-[#357ABD]",
    features: [
      "4 therapy sessions per employee/year",
      "Access to self-assessment quizzes",
      "Community support groups",
      "Mental health resources library",
      "Monthly wellness newsletter",
    ],
  },
  {
    name: "Growth",
    price: "₹1,799",
    per: "per employee/month",
    employees: "Up to 200 employees",
    color: "bg-purple-50 border-purple-200",
    btnColor: "bg-[#7B5EA7] hover:bg-[#6a4f91]",
    popular: true,
    features: [
      "8 therapy sessions per employee/year",
      "Priority therapist matching",
      "Anonymous employee wellness reports",
      "HR dashboard & analytics",
      "Live webinars & workshops",
      "Dedicated account manager",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    per: "tailored to your needs",
    employees: "200+ employees",
    color: "bg-pink-50 border-pink-200",
    btnColor: "bg-[#C084A0] hover:bg-[#a8607f]",
    features: [
      "Unlimited therapy sessions",
      "On-site wellness workshops",
      "Custom mental health programs",
      "Real-time HR analytics dashboard",
      "Crisis intervention support",
      "White-label option available",
      "24/7 dedicated support",
    ],
  },
];

const stats = [
  { value: "71%", label: "of employees report improved productivity" },
  { value: "3x", label: "ROI on mental health investment" },
  { value: "40%", label: "reduction in absenteeism" },
  { value: "85%", label: "employee satisfaction rate" },
];

const faqs = [
  {
    q: "How does employee privacy work?",
    a: "All therapy sessions are completely confidential. HR only sees anonymized, aggregated wellness data — never individual session details.",
  },
  {
    q: "Can employees choose their own therapist?",
    a: "Yes! Employees browse and select therapists based on their preferences, language, and specialization.",
  },
  {
    q: "Is there a minimum contract period?",
    a: "We offer monthly, quarterly, and annual plans. Annual plans come with a 20% discount.",
  },
  {
    q: "What languages are supported?",
    a: "MindBridge supports 10+ Indian languages including Hindi, Bengali, Tamil, Telugu, Marathi, and more.",
  },
];

export default function CorporatePage() {
  return (
    <main className="min-h-screen bg-[#fdf6f0]">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 bg-white/80 backdrop-blur-sm shadow-sm">
        <Link href="/" className="text-2xl font-bold text-[#4A90D9]">
          Mind<span className="text-[#C084A0]">Bridge</span>
          <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-normal">
            Corporate
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-[#4A90D9] transition">
            Home
          </Link>
          <Link
            href="#contact"
            className="bg-[#4A90D9] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#357ABD] transition"
          >
            Get in Touch
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-8 py-24 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-100 rounded-full opacity-30 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-100 rounded-full opacity-30 blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-4 py-1.5 rounded-full tracking-wide">
            🏢 Corporate Wellness
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mt-6 mb-4 leading-tight">
            Invest in your team's{" "}
            <span className="text-[#7B5EA7]">mental wellbeing</span>
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            Give your employees access to professional therapy, self-care tools, and a supportive community — all in one platform.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="#plans"
              className="bg-[#7B5EA7] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#6a4f91] transition shadow-md"
            >
              View Plans
            </Link>
            <Link
              href="#contact"
              className="bg-white text-[#7B5EA7] font-semibold px-8 py-3 rounded-full border border-[#7B5EA7] hover:bg-purple-50 transition"
            >
              Talk to Us
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-8 py-12 bg-white/60">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-bold text-[#7B5EA7]">{s.value}</p>
              <p className="text-sm text-gray-500 mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="px-8 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Choose a plan</h2>
          <p className="text-gray-500">Flexible plans for teams of all sizes</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-3xl p-8 border-2 shadow-sm ${plan.color} flex flex-col`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#7B5EA7] text-white text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold text-gray-800 mb-1">{plan.name}</h3>
              <p className="text-xs text-gray-400 mb-4">{plan.employees}</p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-800">{plan.price}</span>
                <span className="text-sm text-gray-400 ml-2">{plan.per}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="#contact"
                className={`${plan.btnColor} text-white font-semibold py-3 rounded-xl transition text-center text-sm`}
              >
                {plan.name === "Enterprise" ? "Contact Us" : "Get Started"}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-8 py-20 bg-white/60">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">How it works</h2>
            <p className="text-gray-500">Simple setup, immediate impact</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
              { step: "01", icon: "📋", title: "Choose a plan", desc: "Pick the plan that fits your team size and needs" },
              { step: "02", icon: "👥", title: "Onboard employees", desc: "We help you set up and invite your team in minutes" },
              { step: "03", icon: "🧑‍⚕️", title: "Employees get matched", desc: "Each employee finds their ideal therapist" },
              { step: "04", icon: "📊", title: "Track wellness", desc: "Monitor team wellness with anonymized HR reports" },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <span className="text-xs font-bold text-[#7B5EA7] tracking-widest">{s.step}</span>
                <div className="text-4xl my-3">{s.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-8 py-20 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">FAQs</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-8 py-20 bg-gradient-to-br from-[#7B5EA7] to-[#4A90D9] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to support your team?</h2>
          <p className="opacity-80 mb-8">Get in touch and we'll set up a free demo for your organization.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Work email address"
              className="flex-1 px-4 py-3 rounded-xl text-gray-800 text-sm focus:outline-none"
            />
            <button className="bg-white text-[#7B5EA7] font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition">
              Request Demo
            </button>
          </div>
          <p className="text-xs opacity-60 mt-4">No commitment required. Free 30-day trial available.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-6 bg-white text-center">
        <p className="text-sm text-gray-400">
          © 2026 MindBridge Corporate Wellness |{" "}
          <Link href="/" className="text-[#4A90D9] hover:underline">
            Back to MindBridge
          </Link>
        </p>
      </footer>
    </main>
  );
}